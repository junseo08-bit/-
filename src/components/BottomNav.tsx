/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCart } from '../context/CartContext';
import { Home, Coffee, ShoppingBag } from 'lucide-react';

export default function BottomNav() {
  const { screen, navigate, cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  interface NavItem {
    id: 'home' | 'list' | 'cart';
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'list', label: '음료 메뉴', icon: Coffee },
    { id: 'cart', label: '장바구니', icon: ShoppingBag, badge: totalItems },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brand-cream-border shadow-lg backdrop-blur-md bg-opacity-95 md:hidden select-none">
      <div className="max-w-md mx-auto h-[60px] flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = screen === item.id || (item.id === 'list' && screen === 'detail') || (item.id === 'cart' && screen === 'checkout');
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 px-3 transition-colors relative cursor-pointer ${
                isActive ? 'text-brand-primary' : 'text-brand-muted/75 hover:text-brand-primary'
              }`}
              id={`bottom-nav-${item.id}`}
            >
              <div className="relative">
                <IconComponent className={`w-5.5 h-5.5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 right-[-8px] bg-brand-accent text-brand-dark text-[8.5px] font-black px-1.2 rounded-full h-[15px] min-w-[15px] flex items-center justify-center border-2 border-white shadow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9.5px] mt-1 font-semibold ${isActive ? 'font-black text-brand-primary' : 'text-brand-muted/75'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
