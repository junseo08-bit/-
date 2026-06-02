/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'coffee' | 'ade' | 'smoothie' | 'tea';

export interface Beverage {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  rating: number;
  image: string;
  calories: number;
  popular: boolean;
}

export type SizeOption = 'Tall' | 'Grande' | 'Venti';
export type IceOption = '없음' | '적게' | '보통' | '많이';
export type SweetnessOption = '0%' | '30%' | '50%' | '100%';
export type ShotOption = '기본' | '1샷 추가 (+500원)' | '2샷 추가 (+1000원)';
export type WhippingOption = '추가' | '추가 안 함';

export interface CartItemOptions {
  size: SizeOption;
  ice: IceOption;
  sweetness: SweetnessOption;
  shots: ShotOption;
  whipping: WhippingOption;
}

export interface CartItem {
  id: string; // unique item composite key (beverageId + options hash)
  beverage: Beverage;
  options: CartItemOptions;
  quantity: number;
  singlePrice: number; // calculated base price with options
  totalPrice: number;  // singlePrice * quantity
}

export type ScreenType = 'home' | 'list' | 'detail' | 'cart' | 'checkout' | 'confirmed';

export interface Order {
  orderId: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  pickupMethod: '매장 수령' | '포장';
  paymentMethod: '신용카드' | '간편결제' | '현장결제';
  appliedCoupon: {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
  } | null;
  productAmount: number;
  optionsAmount: number;
  totalAmount: number; // (productAmount + optionsAmount) - discount
}
