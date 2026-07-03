'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

type Product = {
  id: number;
  name: string;
  slug?: string;
  price: number;
  image_urls: string[] | null;
};

type CartItem = {
  product: Product;
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Clé localStorage du panier invité — conservée telle quelle (compat avec
// les paniers déjà stockés chez les visiteurs avant ce fix).
const GUEST_CART_KEY = 'philippineasy_cart_guest';

function readCartFromStorage(key: string): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch (error) {
    console.error('Failed to parse cart from localStorage', error);
    return [];
  }
}

// Fusionne le panier invité dans le panier du compte : additionne les
// quantités quand un même produit est present des deux côtés. Pas de cap
// de quantité existant ailleurs dans le codebase (addToCart/updateQuantity
// n'en imposent pas non plus) — on reste cohérent avec ce comportement.
function mergeCarts(accountCart: CartItem[], guestCart: CartItem[]): CartItem[] {
  const merged = accountCart.map((item) => ({ ...item }));
  for (const guestItem of guestCart) {
    const existing = merged.find((item) => item.product.id === guestItem.product.id);
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      merged.push({ ...guestItem });
    }
  }
  return merged;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  // Empêche l'effet de persistance (ci-dessous) d'écrire la valeur `cart`
  // encore périmée dans localStorage juste avant que ce même effet de
  // chargement/fusion applique sa mise à jour d'état (les deux effets
  // tournent dans le même commit React quand `user` change).
  const isSyncingRef = useRef(false);

  useEffect(() => {
    isSyncingRef.current = true;

    if (user) {
      const userKey = `philippineasy_cart_${user.id}`;
      const accountCart = readCartFromStorage(userKey);
      const guestCart = readCartFromStorage(GUEST_CART_KEY);

      if (guestCart.length > 0) {
        // Connexion (ou reprise de session) avec un panier invité en attente
        // -> fusion dans le panier du compte, puis nettoyage du panier invité.
        const merged = mergeCarts(accountCart, guestCart);
        setCart(merged);
        if (typeof window !== 'undefined') {
          localStorage.setItem(userKey, JSON.stringify(merged));
          localStorage.removeItem(GUEST_CART_KEY);
        }
      } else {
        setCart(accountCart);
      }
    } else {
      // Anonyme (ou déconnexion) : on recharge le panier invité existant au
      // lieu de le vider — sinon il est perdu au reload (bug corrigé 2026-07-03).
      setCart(readCartFromStorage(GUEST_CART_KEY));
    }
  }, [user]);

  useEffect(() => {
    if (isSyncingRef.current) {
      // Skip : ce passage correspond au `cart` pré-chargement/fusion, déjà
      // géré (et persisté si besoin) par l'effet ci-dessus.
      isSyncingRef.current = false;
      return;
    }
    // Save cart to localStorage whenever it changes, specific to user or guest
    const cartKey = user ? `philippineasy_cart_${user.id}` : GUEST_CART_KEY;
    if (cart.length > 0) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } else {
      // Remove item from localStorage if cart is empty to keep it clean
      localStorage.removeItem(cartKey);
    }
  }, [cart, user]);

  const addToCart = (product: Product, quantity = 1) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
      toast.success(`${product.name} quantité mise à jour.`);
    } else {
      setCart([...cart, { product, quantity }]);
      toast.success(`${product.name} ajouté au panier !`);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast.success('Produit retiré du panier.');
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
