/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CartItem, 
  Beverage, 
  CartItemOptions, 
  ScreenType, 
  Order, 
  Category 
} from '../types';
import { CouponItem } from '../beveragesData';

interface CartContextType {
  screen: ScreenType;
  selectedBeverageId: string | null;
  selectedCategory: Category | 'all';
  searchQuery: string;
  cart: CartItem[];
  activeCoupon: CouponItem | null;
  activeOrder: Order | null;
  
  // Navigation
  navigate: (screen: ScreenType, beverageId?: string | null, category?: Category | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | 'all') => void;
  
  // Cart Actions
  addToCart: (beverage: Beverage, options: CartItemOptions, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  
  // Coupon Actions
  applyCoupon: (coupon: CouponItem | null) => void;
  
  // Ordering
  placeOrder: (
    customerName: string, 
    customerPhone: string, 
    pickupMethod: '매장 수령' | '포장', 
    paymentMethod: '신용카드' | '간편결제' | '현장결제'
  ) => void;
  resetOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<ScreenType>('home');
  const [selectedBeverageId, setSelectedBeverageId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategoryState] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCoupon, setActiveCoupon] = useState<CouponItem | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Sync scroll on navigate
  const navigate = (nextScreen: ScreenType, beverageId: string | null = null, category: Category | 'all' = 'all') => {
    setScreen(nextScreen);
    if (beverageId) setSelectedBeverageId(beverageId);
    if (category !== 'all' || nextScreen === 'list') {
      setSelectedCategoryState(category);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const setSelectedCategory = (category: Category | 'all') => {
    setSelectedCategoryState(category);
  };

  // Option-based price calculator
  const calculateSinglePrice = (beveragePrice: number, options: CartItemOptions): number => {
    let extra = 0;
    
    // Size costs
    if (options.size === 'Grande') {
      extra += 500;
    } else if (options.size === 'Venti') {
      extra += 1000;
    }

    // Shots costs
    if (options.shots.includes('1샷')) {
      extra += 500;
    } else if (options.shots.includes('2샷')) {
      extra += 1000;
    }

    return beveragePrice + extra;
  };

  // Generate a unique options string to combine identical items
  const generateHash = (beverageId: string, options: CartItemOptions): string => {
    return `${beverageId}-${options.size}-${options.ice}-${options.sweetness}-${options.shots}-${options.whipping}`;
  };

  const addToCart = (beverage: Beverage, options: CartItemOptions, quantity: number) => {
    const singlePrice = calculateSinglePrice(beverage.price, options);
    const hash = generateHash(beverage.id, options);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.id === hash);
      if (existingIndex !== -1) {
        // Option signature matches! Combine quantity
        const updatedCart = [...prevCart];
        const prevItem = updatedCart[existingIndex];
        const nextQuantity = prevItem.quantity + quantity;
        updatedCart[existingIndex] = {
          ...prevItem,
          quantity: nextQuantity,
          totalPrice: prevItem.singlePrice * nextQuantity,
        };
        return updatedCart;
      } else {
        // New item configuration
        return [
          ...prevCart,
          {
            id: hash,
            beverage,
            options,
            quantity,
            singlePrice,
            totalPrice: singlePrice * quantity,
          }
        ];
      }
    });

    // Automatically navigate back to List view so they can see categories or shop item
  };

  const updateQuantity = (itemId: string, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) => 
      prevCart.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: nextQuantity,
            totalPrice: item.singlePrice * nextQuantity,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const applyCoupon = (coupon: CouponItem | null) => {
    setActiveCoupon(coupon);
  };

  const placeOrder = (
    customerName: string, 
    customerPhone: string, 
    pickupMethod: '매장 수령' | '포장', 
    paymentMethod: '신용카드' | '간편결제' | '현장결제'
  ) => {
    // Generate order calculations
    const productAmount = cart.reduce((acc, item) => acc + (item.beverage.price * item.quantity), 0);
    const optionsAmount = cart.reduce((acc, item) => acc + ((item.singlePrice - item.beverage.price) * item.quantity), 0);
    const totalAmountBeforeCoupon = productAmount + optionsAmount;
    
    let couponDiscount = 0;
    if (activeCoupon) {
      if (activeCoupon.discountType === 'percentage') {
        couponDiscount = Math.round((totalAmountBeforeCoupon * activeCoupon.discountValue) / 100);
      } else {
        couponDiscount = activeCoupon.discountValue;
      }
    }

    const totalAmount = Math.max(0, totalAmountBeforeCoupon - couponDiscount);
    const orderNo = 'E-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      orderId: orderNo,
      items: [...cart],
      customerName,
      customerPhone,
      pickupMethod,
      paymentMethod,
      appliedCoupon: activeCoupon,
      productAmount,
      optionsAmount,
      totalAmount,
    };

    setActiveOrder(newOrder);
    setCart([]); // Reset Cart now
    setActiveCoupon(null); // Clear active checkout coupon
    setScreen('confirmed');
  };

  const resetOrder = () => {
    setActiveOrder(null);
    setScreen('home');
  };

  return (
    <CartContext.Provider value={{
      screen,
      selectedBeverageId,
      selectedCategory,
      searchQuery,
      cart,
      activeCoupon,
      activeOrder,
      navigate,
      setSearchQuery,
      setSelectedCategory,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      placeOrder,
      resetOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
