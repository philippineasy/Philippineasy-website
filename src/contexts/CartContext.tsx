'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

type Product = {
  id: number;
  name: string;
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const cartKey = user ? `philippineasy_cart_${user.id}` : 'philippineasy_cart_guest';
    // Load cart from localStorage on user change
    if (user) {
      try {
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCart([]);
      }
    } else {
      // User is logged out, clear the cart
      setCart([]);
      // Optionally, clear guest cart from local storage if you don't want to persist it
      // localStorage.removeItem('philippineasy_cart_guest');
    }
  }, [user]);

  useEffect(() => {
    // Save cart to localStorage whenever it changes, specific to user or guest
    const cartKey = user ? `philippineasy_cart_${user.id}` : 'philippineasy_cart_guest';
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

  const clearCart = () => {
    setCart([]);
  };

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
