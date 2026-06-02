/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCart } from '../context/CartContext';
import { Check, ClipboardList, Home, RefreshCw, ShoppingBag, MapPin, CreditCard, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function ConfirmedView() {
  const { activeOrder, resetOrder, navigate } = useCart();

  // Guard Clause fallback if they refresh or visit this screen on empty state
  if (!activeOrder) {
    return (
      <div className="w-full max-w-md mx-auto bg-brand-cream-bg text-brand-text min-h-[calc(100vh-4rem)] p-6 flex flex-col items-center justify-center text-center select-none font-sans">
        <ShoppingBag className="w-12 h-12 text-brand-muted/50 mb-3" />
        <h4 className="font-extrabold text-sm">확인 불가능한 주문 내역</h4>
        <button 
          onClick={resetOrder}
          className="mt-4 px-6 h-10 rounded-full bg-brand-primary text-white text-xs font-bold"
        >
          메인화면으로 이동하기
        </button>
      </div>
    );
  }

  const handleOrderAgain = () => {
    resetOrder(); // This clears the order summary and navigates back home
    navigate('list'); // Redirects straight to list view!
  };

  return (
    <div className="w-full max-w-md mx-auto bg-brand-cream-bg text-brand-text min-h-[calc(100vh-4rem)] pb-20 px-4 font-sans">
      
      {/* 1. Header illustration success block */}
      <div className="pt-10 pb-6 flex flex-col items-center justify-center text-center select-none">
        
        {/* Animated green ring check icon */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center shadow-xl border-4 border-brand-light-green relative"
        >
          <Check className="w-10 h-10 text-white " />
          {/* Sparkly visual additions */}
          <Sparkles className="w-5 h-5 text-brand-accent absolute -top-1 -right-1 animate-pulse" />
        </motion.div>

        <h3 className="text-xl font-extrabold text-brand-dark mt-6">그린머그 주문 완료!</h3>
        <p className="text-xs text-brand-muted mt-2 max-w-[280px] mx-auto leading-relaxed">
          고객님, 주문하신 맛있는 음료 접수가 완료되어 정성껏 제조를 시작하겠습니다.
        </p>
      </div>

      {/* 2. Order Number badge */}
      <div className="bg-[#00704a]/7 rounded-2xl p-4.5 border border-brand-primary/10 flex items-center justify-between shadow-sm mb-6 select-none" id="confirmed-orderno-card">
        <div className="flex items-center gap-2">
          <div className="bg-brand-primary rounded-lg p-2">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">주문 고유 번호</div>
            <div className="text-lg font-black text-brand-dark leading-none mt-1" id="confirmed-orderno-text">{activeOrder.orderId}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10.5px] bg-[#00704a] text-brand-cream-bg font-extrabold px-3 py-1 rounded-full animate-pulse">
            제조 준비 중 ☕
          </div>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* 3. Customer & Receipt details panel */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm select-none">
          <h4 className="font-extrabold text-xs text-brand-dark border-b border-brand-cream-border pb-3 uppercase tracking-wider mb-3.5">수령인 및 수령 상세 정보</h4>
          
          <div className="space-y-3 font-semibold text-xs text-brand-muted">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-accent" />
              <span>주문 수령인: <strong className="text-brand-dark">{activeOrder.customerName}</strong> ({activeOrder.customerPhone})</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-accent" />
              <span>수령 수단: <strong className="text-brand-dark">{activeOrder.pickupMethod}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-accent" />
              <span>결제 수단: <strong className="text-brand-dark">{activeOrder.paymentMethod}</strong></span>
            </div>
          </div>
        </div>

        {/* 4. Summarized list of ordered beverages */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm">
          <h4 className="font-extrabold text-xs text-brand-dark border-b border-brand-cream-border pb-3 uppercase tracking-wider mb-2.5">상세 주문 상품 요약</h4>
          
          <div className="divide-y divide-brand-cream-border">
            {activeOrder.items.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-brand-dark truncate">{item.beverage.name}</div>
                  <div className="text-[9.5px] text-brand-muted font-bold mt-0.5 mt-0.5">
                    {item.options.size} (+{item.options.size === 'Tall' ? '0' : item.options.size === 'Grande' ? '500' : '1,000'}원) / 얼음: {item.options.ice}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-brand-muted font-bold px-1.5">{item.quantity}개</span>
                  <span className="font-extrabold text-brand-dark">{item.totalPrice.toLocaleString()}원</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-cream-border pt-3 mt-1 flex items-baseline justify-between select-none">
            <span className="text-xs font-black text-brand-dark">최종 결제 금액</span>
            <span className="text-base font-black text-brand-primary">
              {activeOrder.totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 5. Utility action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 select-none">
          <button
            onClick={resetOrder}
            className="h-11 rounded-full border border-brand-cream-border hover:border-brand-primary/30 text-brand-dark font-extrabold bg-white text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            id="confirmed-home-btn"
          >
            <Home className="w-4 h-4 text-brand-accent" />
            홈으로 이동
          </button>
          
          <button
            onClick={handleOrderAgain}
            className="h-11 rounded-full bg-brand-primary hover:bg-brand-dark text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            id="confirmed-reorder-btn"
          >
            <RefreshCw className="w-4 h-4 text-brand-accent h-[16px]" />
            다시 주문하기
          </button>
        </div>

      </div>

    </div>
  );
}
