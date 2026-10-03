import { CartItem, Product, Address } from '../types';
import { formatCurrency } from './currency';

const DEFAULT_WHATSAPP_NUMBER = import.meta.env.VITE_STORE_WHATSAPP || '919876543210';

export function createProductWhatsAppUrl(product: Product, size?: string, quantity: number = 1): string {
  const text = `नमस्ते वंदना साड़ी सेंटर! 🙏\n\nमुझे यह प्रोडक्ट ऑर्डर करना है:\n*${product.name}*\n(कोड: ${product.slug})\nकीमत: ${formatCurrency(product.price)}\n${size ? `साइज़: ${size}\n` : ''}मात्रा: ${quantity}\n\nकृपया डिलीवरी और पेमेंट की जानकारी दें। धन्यवाद!`;
  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function createCartWhatsAppUrl(items: CartItem[], address?: Address, totalAmount?: number): string {
  let itemList = items
    .map((item, idx) => `${idx + 1}. ${item.product.name} (साइज़: ${item.selected_size}, मात्रा: ${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`)
    .join('\n');

  let text = `नमस्ते वंदना साड़ी सेंटर! 🙏\n\nमैं अपनी शॉपिंग कार्ट का ऑर्डर देना चाहता/चाहती हूं:\n\n${itemList}\n\n*कुल राशि: ${formatCurrency(totalAmount || items.reduce((s, i) => s + i.price * i.quantity, 0))}*`;

  if (address) {
    text += `\n\n*डिलीवरी का पता:*\nनाम: ${address.full_name}\nफोन: ${address.phone}\nपता: ${address.address_line}\nगांव/कस्बा: ${address.village || address.town || ''}\nजिला: ${address.district}, पिन: ${address.pincode}`;
  }

  text += `\n\nकृपया ऑर्डर कन्फर्म करें।`;

  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function createInquiryWhatsAppUrl(message?: string): string {
  const text = message || `नमस्ते वंदना साड़ी सेंटर! 🙏 मुझे कपड़ों के बारे में जानकारी चाहिए।`;
  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
