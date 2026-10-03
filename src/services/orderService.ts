import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order, OrderStatus } from '../types';

const LOCAL_STORAGE_ORDERS_KEY = 'vandna_local_orders_v1';

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord_sample_1',
    order_number: 'VSC-2026-8812',
    user_id: 'guest_demo',
    shipping_address: {
      id: 'addr_1',
      full_name: 'रमेश कुमार शर्मा',
      phone: '+91 98765 12345',
      address_line: 'मकान नं. 45, गांधी नगर',
      town: 'सुल्तानपुर',
      district: 'सुल्तानपुर',
      state: 'उत्तर प्रदेश',
      pincode: '228001',
      landmark: 'प्राथमिक विद्यालय के पास',
    },
    items: [
      {
        id: 'item_1',
        product_id: 'p1',
        product_name: 'Royal Crimson Banarasi Katan Silk Saree',
        image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        price: 2499,
        total: 2499,
        selected_size: 'Free Size',
      },
    ],
    subtotal: 2499,
    discount: 250,
    delivery_charge: 0,
    total_amount: 2249,
    payment_method: 'cod',
    payment_status: 'pending',
    order_status: 'shipped',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    tracking_updates: [
      { status: 'placed', timestamp: '2 days ago', note: 'Order placed by customer via Cash on Delivery' },
      { status: 'confirmed', timestamp: '2 days ago', note: 'Order verified by Vandna Saree Center team' },
      { status: 'packed', timestamp: '1 day ago', note: 'Carefully packaged with gift wrapping' },
      { status: 'shipped', timestamp: 'Yesterday', note: 'Dispatched with BlueDart Express courier (AWB: BD893201)' },
    ],
  },
];

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read local orders:', e);
  }
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_SAMPLE_ORDERS));
  return INITIAL_SAMPLE_ORDERS;
}

function saveStoredOrders(orders: Order[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to write local orders:', e);
  }
}

export const orderService = {
  async getOrders(userId?: string): Promise<Order[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((o) => ({
            id: o.id,
            order_number: o.order_number,
            user_id: o.user_id,
            shipping_address: o.shipping_address_snapshot || {},
            items: o.order_items || [],
            subtotal: o.subtotal,
            discount: o.discount,
            delivery_charge: o.delivery_charge,
            total_amount: o.total_amount,
            payment_method: o.payment_method,
            payment_status: o.payment_status,
            order_status: o.order_status,
            created_at: o.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase getOrders failed, using local', e);
      }
    }

    const orders = getStoredOrders();
    if (userId) {
      return orders.filter((o) => !o.user_id || o.user_id === userId);
    }
    return orders;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === orderId || o.order_number === orderId) || null;
  },

  async createOrder(orderInput: Omit<Order, 'id' | 'order_number' | 'created_at'>): Promise<Order> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `VSC-${new Date().getFullYear()}-${randomSuffix}`;
    const newOrder: Order = {
      ...orderInput,
      id: 'ord_' + Date.now(),
      order_number: orderNumber,
      created_at: new Date().toISOString(),
      tracking_updates: [
        {
          status: 'placed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Order received. Payment mode: ${orderInput.payment_method.toUpperCase()}`,
        },
      ],
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: insertedOrder } = await supabase
          .from('orders')
          .insert([
            {
              order_number: newOrder.order_number,
              user_id: newOrder.user_id || null,
              shipping_address_snapshot: newOrder.shipping_address,
              subtotal: newOrder.subtotal,
              discount: newOrder.discount,
              delivery_charge: newOrder.delivery_charge,
              total_amount: newOrder.total_amount,
              payment_method: newOrder.payment_method,
              payment_status: newOrder.payment_status,
              order_status: newOrder.order_status,
            },
          ])
          .select()
          .single();

        if (insertedOrder) {
          const itemsPayload = newOrder.items.map((it) => ({
            order_id: insertedOrder.id,
            product_id: it.product_id,
            product_name: it.product_name,
            quantity: it.quantity,
            price: it.price,
            total: it.total,
          }));
          await supabase.from('order_items').insert(itemsPayload);
        }
      } catch (err) {
        console.warn('Supabase order creation fallback to local', err);
      }
    }

    const current = getStoredOrders();
    saveStoredOrders([newOrder, ...current]);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('orders').update({ order_status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase updateOrderStatus failed', e);
      }
    }

    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (index !== -1) {
      orders[index].order_status = newStatus;
      if (!orders[index].tracking_updates) {
        orders[index].tracking_updates = [];
      }
      orders[index].tracking_updates!.push({
        status: newStatus,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: `Order status updated to ${newStatus.toUpperCase()}`,
      });
      saveStoredOrders(orders);
      return true;
    }
    return false;
  },
};
