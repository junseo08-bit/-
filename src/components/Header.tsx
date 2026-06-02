/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, Coffee } from 'lucide-react';

export default function Header() {
  const { screen, navigate, cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getScreenTitle = () => {
    switch (screen) {
      case 'home':
        return 'Green Mug';
      case 'list':
        return '음료 메뉴';
      case 'detail':
        return '옵션 선택';
      case 'cart':
        return '장바구니';
      case 'checkout':
        return '주문하기';
      case 'confirmed':
        return '주문 완료';
      default:
        return 'Green Mug';
    }
  };

  const handleBack = () => {
    if (screen === 'detail') {
      navigate('list');
    } else if (screen === 'cart') {
      navigate('list');
    } else if (screen === 'checkout') {
      navigate('cart');
    } else if (screen === 'confirmed') {
      navigate('home');
    } else {
      navigate('home');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-dark text-white shadow-lg backdrop-blur-md bg-opacity-95 transition-all">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left Side: Back button OR Starbucks-style Coffee Cup Icon */}
        <div className="w-10">
          {screen !== 'home' && screen !== 'confirmed' ? (
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/50 cursor-pointer"
              aria-label="뒤로가기"
              id="header-back-btn"
            >
              <ArrowLeft className="w-6 h-6 text-brand-cream-bg" />
            </button>
          ) : (
            <div 
              onClick={() => navigate('home')}
              className="flex items-center justify-center w-10 h-10 bg-brand-primary/20 rounded-full cursor-pointer hover:scale-105 transition-transform"
              id="header-logo-icon"
            >
              <Coffee className="w-5 h-5 text-brand-accent" />
            </div>
          )}
        </div>

        {/* Center: Brand name or screen title */}
        <div className="flex-1 text-center font-bold tracking-tight text-lg flex items-center justify-center gap-1.5 select-none">
          {screen === 'home' && (
            <span className="text-brand-accent font-extrabold text-xl font-sans tracking-wide">GREEN MUG</span>
          )}
          {screen !== 'home' && (
            <span className="text-brand-cream-bg font-semibold">{getScreenTitle()}</span>
          )}
        </div>

        {/* Right Side: Cart Icon Badge */}
        <div className="w-10 flex justify-end">
          {screen !== 'confirmed' && (
            <button 
              onClick={() => navigate('cart')}
              className="relative p-2.5 hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/50 cursor-pointer"
              aria-label="장바구니 보기"
              id="header-cart-btn"
            >
              <ShoppingBag className="w-5 h-5 text-brand-cream-bg" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-brand-accent text-brand-dark text-[10px] font-extrabold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-brand-dark animate-bounce shadow">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
