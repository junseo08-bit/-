/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ChevronRight, CornerDownRight, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function CartView() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    navigate,
    clearCart 
  } = useCart();

  // Computations for product amounts vs additional option amounts
  const paymentMetrics = useMemo(() => {
    let productAmount = 0;
    let optionsAmount = 0;

    cart.forEach((item) => {
      // Base cost of the beverage
      productAmount += item.beverage.price * item.quantity;
      // Extra options costs (Size upgrade + custom shots extra)
      const itemOptionDiff = item.singlePrice - item.beverage.price;
      optionsAmount += itemOptionDiff * item.quantity;
    });

    const totalAmount = productAmount + optionsAmount;

    return {
      productAmount,
      optionsAmount,
      totalAmount
    };
  }, [cart]);

  const handleCheckoutTransition = () => {
    if (cart.length > 0) {
      navigate('checkout');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-brand-cream-bg text-brand-text min-h-[calc(100vh-4rem)] pb-36 px-4 font-sans relative">
      <div className="pt-5 pb-3 flex items-center justify-between select-none">
        <h3 className="text-lg font-black text-brand-dark flex items-center gap-1.5">
          주문 바구니 <span className="text-sm font-bold text-brand-muted">({cart.length}개 상품)</span>
        </h3>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-[11px] font-extrabold text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100"
            id="cart-clear-all-btn"
          >
            <Trash2 className="w-3 h-3" /> 전체삭제
          </button>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="space-y-4">
          
          {/* Cart items list */}
          <div className="space-y-3">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-4 border border-brand-cream-border shadow-sm flex flex-col gap-3.5 hover:shadow-md transition-shadow"
                id={`cart-item-${item.id}`}
              >
                {/* Upper Beverage info */}
                <div className="flex items-start gap-3">
                  <img 
                    src={item.beverage.image} 
                    alt={item.beverage.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border border-brand-cream-border bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-extrabold text-sm text-brand-dark truncate">{item.beverage.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-brand-muted/50 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-full transition-all cursor-pointer"
                        aria-label="삭제"
                        id={`cart-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Selected Options visualization */}
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="inline-flex items-center text-[9px] font-black bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded-md border border-brand-primary/10">
                        {item.options.size} (+{item.options.size === 'Tall' ? '0' : item.options.size === 'Grande' ? '500' : '1,000'}원)
                      </span>
                      <span className="inline-flex items-center text-[9px] font-semibold bg-brand-cream-bg text-brand-muted px-1.5 py-0.5 rounded-md border border-brand-cream-border">
                        얼음: {item.options.ice}
                      </span>
                      <span className="inline-flex items-center text-[9px] font-semibold bg-brand-cream-bg text-brand-muted px-1.5 py-0.5 rounded-md border border-brand-cream-border">
                        당도: {item.options.sweetness}
                      </span>
                      {item.options.shots !== '기본' && (
                        <span className="inline-flex items-center text-[9px] font-extrabold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-100">
                          {item.options.shots.split(' ')[0]} 샷추가
                        </span>
                      )}
                      {item.options.whipping === '추가' && (
                        <span className="inline-flex items-center text-[9px] font-semibold bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded-md border border-pink-100">
                          휘핑추가
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub operation widget footer inside card */}
                <div className="pt-3 border-t border-brand-cream-border flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-brand-cream-bg p-0.5 rounded-xl border border-brand-cream-border">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-dark hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                      id={`cart-decrease-${item.id}`}
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-brand-dark select-none">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-dark hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                      id={`cart-increase-${item.id}`}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-brand-muted font-bold block">
                      단가 {item.singlePrice.toLocaleString()}원
                    </div>
                    <div className="text-xs font-extrabold text-brand-dark mt-0.5">
                      금액 {item.totalPrice.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary Card (주문 요약 카드) */}
          <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm mt-6 select-none" id="cart-summary-card">
            <h4 className="font-extrabold text-xs text-brand-dark border-b border-brand-cream-border pb-3 uppercase tracking-wider flex items-center gap-1.5">
              <span>주문 요약 카드</span>
              <HelpCircle className="w-3.5 h-3.5 text-brand-muted/70" />
            </h4>
            
            <div className="space-y-2.5 mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
                <span>상품 총 가격 (기본가)</span>
                <span>{paymentMetrics.productAmount.toLocaleString()}원</span>
              </div>
              
              <div className="flex items-center justify-between text-xs font-semibold text-brand-muted">
                <span className="flex items-center gap-0.5 text-xs">
                  <CornerDownRight className="w-3.5 h-3.5 text-brand-accent stroke-[2.5]" />
                  사이즈 및 샷 추가 금액
                </span>
                <span className="text-brand-accent">{paymentMetrics.optionsAmount > 0 ? `+${paymentMetrics.optionsAmount.toLocaleString()}원` : '0원'}</span>
              </div>
              
              <div className="border-t border-dashed border-brand-cream-border pt-4 mt-2 flex items-baseline justify-between">
                <span className="text-xs font-black text-brand-dark">최종 결제 금액</span>
                <span className="text-base font-black text-brand-primary">
                  {paymentMetrics.totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="bg-brand-cream-bg rounded-xl p-3.5 border border-brand-cream-border mt-4 text-[10px] text-brand-muted leading-relaxed font-semibold">
              🎁 다음 단계 주문 화면에서 다양한 웰컴 할인 쿠폰을 적용하실 수 있습니다. 쿠폰 할인을 놓치지 마세요!
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-3xl border border-brand-cream-border shadow-sm mb-12 select-none">
          <div className="w-16 h-16 bg-brand-cream-bg rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-7 h-7 text-[#00704a]/70" />
          </div>
          <h4 className="font-extrabold text-md text-brand-dark">장바구니가 비어 있습니다</h4>
          <p className="text-xs text-brand-muted mt-1.5 leading-relaxed max-w-[240px] mx-auto">준서카페가 엄선하여 준비한 신선하고 맛있는 음료들을 장바구니에 담아 주문을 시작해보세요!</p>
          <button
            onClick={() => navigate('list')}
            className="mt-6 h-[42px] px-8 rounded-full bg-brand-primary hover:bg-brand-dark text-white text-xs font-extrabold transition-all shadow-md cursor-pointer animate-pulse"
            id="cart-go-shopping"
          >
            음료 구경하러 가기
          </button>
        </div>
      )}

      {/* 6. Bottom Sticky CTA bar - Only show when items are active */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 -mx-4 bg-white border-t border-brand-cream-border shadow-md z-40 px-4 pt-3 pb-4 mt-6">
          <div className="max-w-md mx-auto px-4 pt-4 pb-6 flex items-center justify-between gap-4">
            <div className="flex flex-col select-none">
              <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">주문하실 내역 합계</span>
              <span className="text-lg font-black text-brand-dark">
                {paymentMetrics.totalAmount.toLocaleString()}원
              </span>
            </div>

            <button
              onClick={handleCheckoutTransition}
              className="flex-1 h-[50px] rounded-full bg-brand-primary text-white font-extrabold hover:bg-brand-dark transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              id="cart-checkout-cta"
            >
              주문하기 <ChevronRight className="w-4.5 h-4.5 stroke-[2.5] h-[18px]" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
