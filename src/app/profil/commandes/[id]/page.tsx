import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';

async function getOrderDetails(supabase: ReturnType<typeof createClient>, orderId: number, userId: string) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId) // Security check
    .single();

  if (orderError || !order) {
    notFound();
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      quantity,
      price,
      products (
        name,
        slug,
        image_urls
      )
    `)
    .eq('order_id', orderId);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return { order, items: [] };
  }

  return { order, items };
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const orderId = parseInt(id, 10);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/connexion');
  }

  const { order, items } = await getOrderDetails(supabase, orderId, user.id);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Détail de la Commande</h1>
        <p className="text-muted-foreground mb-8">Commande #{order.id} - {new Date(order.created_at).toLocaleDateString('fr-FR')}</p>

        <div className="bg-card p-6 rounded-lg shadow-md">
          <ul className="space-y-4">
            {items.map((item: any, index: number) => (
              <li key={index} className="flex items-center space-x-4">
                <div className="relative w-20 h-20 rounded-md overflow-hidden">
                  <Image src={item.products.image_urls?.[0] || 'https://via.placeholder.com/150'} alt={item.products.name} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">{item.products.name}</p>
                  <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                  <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} € / unité</p>
                </div>
              </li>
            ))}
          </ul>
          <hr className="my-6" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{order.total_amount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span>À calculer</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-2 border-t">
              <span>Total</span>
              <span>{order.total_amount.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
