/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import HomeView from './components/HomeView';
import ListView from './components/ListView';
import DetailView from './components/DetailView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import ConfirmedView from './components/ConfirmedView';
import BottomNav from './components/BottomNav';

function AppContent() {
  const { screen } = useCart();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center md:py-6 md:px-4">
      {/* Phone device mockup enclosing container */}
      <div className="w-full max-w-md h-screen md:h-[840px] md:max-h-[840px] md:rounded-[2.8rem] bg-brand-cream-bg md:shadow-[0_24px_80px_rgba(30,57,50,0.15)] md:border-[10px] md:border-brand-dark overflow-hidden flex flex-col relative select-none">
        
        {/* Sticky Header at the top */}
        <Header />
        
        {/* Main interactive viewport scroll */}
        <main className="flex-1 overflow-y-auto relative no-scrollbar scrollbar-none pb-12 select-text">
          {screen === 'home' && <HomeView />}
          {screen === 'list' && <ListView />}
          {screen === 'detail' && <DetailView />}
          {screen === 'cart' && <CartView />}
          {screen === 'checkout' && <CheckoutView />}
          {screen === 'confirmed' && <ConfirmedView />}
        </main>
        
        {/* Bottom Navigation tab */}
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
