/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { SAMPLE_COUPONS, CouponItem } from '../beveragesData';
import { CreditCard, Smartphone, Store, ShieldCheck, Ticket, User, Phone, CheckCircle, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CheckoutView() {
  const { 
    cart, 
    activeCoupon, 
    applyCoupon, 
    placeOrder, 
    navigate 
  } = useCart();

  // Inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'매장 수령' | '포장'>('매장 수령');
  const [paymentMethod, setPaymentMethod] = useState<'신용카드' | '간편결제' | '현장결제'>('신용카드');

  // Interactive coupon picker dropdown state
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Form Validations states
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Auto phone formatting helper as they type
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    // Format to 010-0000-0000 style
    if (value.length > 3 && value.length <= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    
    setCustomerPhone(value);
    if (value.trim()) {
      setPhoneError(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
    if (e.target.value.trim()) {
      setNameError(false);
    }
  };

  // Computations for raw products price
  const cartSums = useMemo(() => {
    let productAmount = 0;
    let optionsAmount = 0;

    cart.forEach((item) => {
      productAmount += item.beverage.price * item.quantity;
      const optionDiff = item.singlePrice - item.beverage.price;
      optionsAmount += optionDiff * item.quantity;
    });

    const subTotal = productAmount + optionsAmount;

    // Coupon discount logic
    let couponDiscount = 0;
    if (activeCoupon) {
      if (activeCoupon.discountType === 'percentage') {
        couponDiscount = Math.round((subTotal * activeCoupon.discountValue) / 100);
      } else {
        couponDiscount = activeCoupon.discountValue;
      }
    }

    const finalAmount = Math.max(0, subTotal - couponDiscount);

    return {
      productAmount,
      optionsAmount,
      subTotal,
      couponDiscount,
      finalAmount
    };
  }, [cart, activeCoupon]);

  const handleSubmitOrder = () => {
    let hasError = false;

    if (!customerName.trim()) {
      setNameError(true);
      hasError = true;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setPhoneError(true);
      hasError = true;
    }

    if (hasError) {
      // Focus/Scroll into validation error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // Call placing order context action which handles state resets
    placeOrder(customerName, customerPhone, pickupMethod, paymentMethod);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-brand-cream-bg text-brand-text min-h-[calc(100vh-4rem)] pb-36 px-4 font-sans relative">
      
      {/* 1. Brief overview panel of cart state */}
      <div className="pt-5 pb-3">
        <h3 className="text-lg font-black text-brand-dark">주문/결제하기</h3>
        <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">고객님, 주문 내역을 꼼꼼하게 확인하신 뒤 결제 수단을 입력해주세요.</p>
      </div>

      <div className="space-y-5">

        {/* 2. List of summarized order items */}
        <div className="bg-white rounded-3xl p-4.5 border border-brand-cream-border shadow-sm">
          <div className="flex items-center justify-between border-b border-brand-cream-border pb-2.5 mb-3 select-none">
            <h4 className="font-extrabold text-xs text-brand-dark uppercase tracking-wider">주문 상품 목록 ({cart.length}종)</h4>
            <button 
              onClick={() => navigate('cart')} 
              className="text-[10px] text-brand-primary font-bold hover:underline cursor-pointer"
              id="checkout-edit-cart-btn"
            >
              수정하기
            </button>
          </div>

          <div className="divide-y divide-brand-cream-border max-h-[140px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-brand-dark truncate">{item.beverage.name}</div>
                  <div className="text-[9.5px] text-brand-muted font-bold mt-0.5 mt-0.5">
                    {item.options.size} / 얼음 {item.options.ice}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-brand-muted">{item.quantity}개</div>
                  <div className="font-extrabold text-brand-dark mt-0.5">{item.totalPrice.toLocaleString()}원</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Customer detail inputs */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm">
          <h4 className="font-extrabold text-xs text-brand-dark border-b border-brand-cream-border pb-3 uppercase tracking-wider mb-4 select-none">주문자 정보 입력</h4>
          
          <div className="space-y-4">
            
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1.5 flex items-center gap-1 select-none">
                <User className="w-3.5 h-3.5 text-brand-primary" /> 수령인 한글 이름
              </label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="예: 홍길동"
                  value={customerName}
                  onChange={handleNameChange}
                  className={`w-full h-11 px-4 bg-brand-cream-bg/30 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/80 transition-all ${
                    nameError ? 'border-rose-400 focus:ring-rose-200' : 'border-brand-cream-border'
                  }`}
                  id="checkout-name-input"
                />
              </div>
              {nameError && (
                <p className="text-[10px] text-rose-500 font-bold mt-1.5 select-none" id="checkout-name-error">⚠️ 이름을 입력해주세요.</p>
              )}
            </div>

            {/* Contact Phone Input */}
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1.5 flex items-center gap-1 select-none">
                <Phone className="w-3.5 h-3.5 text-brand-primary" /> 핸드폰 연동 연락처
              </label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="010-XXXX-XXXX"
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  className={`w-full h-11 px-4 bg-brand-cream-bg/30 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary/80 transition-all ${
                    phoneError ? 'border-rose-400 focus:ring-rose-200' : 'border-brand-cream-border'
                  }`}
                  id="checkout-phone-input"
                />
              </div>
              {phoneError && (
                <p className="text-[10px] text-rose-500 font-bold mt-1.5 select-none" id="checkout-phone-error">⚠️ 올바른 연락처 번호를 입력해주세요.</p>
              )}
            </div>

          </div>
        </div>

        {/* 4. Receiving method option */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm select-none">
          <h4 className="font-extrabold text-xs text-brand-dark border-b border-brand-cream-border pb-3 uppercase tracking-wider mb-4">수령 방법 선택</h4>
          
          <div className="grid grid-cols-2 gap-3" id="checkout-pickup-methods">
            {(['매장 수령', '포장'] as const).map((method) => {
              const matched = pickupMethod === method;
              return (
                <button
                  key={method}
                  onClick={() => setPickupMethod(method)}
                  className={`h-12 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                    matched 
                      ? 'border-brand-primary bg-brand-light-green text-brand-dark shadow-sm' 
                      : 'border-brand-cream-border bg-brand-cream-bg/30 text-brand-muted hover:border-brand-primary/30'
                  }`}
                  id={`checkout-pickup-btn-${method}`}
                >
                  {method === '매장 수령' ? '✨ 매장 주문 (일회용컵 불가)' : '🛍️ 포장 (Take-out)'}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-brand-muted font-bold mt-3 leading-relaxed">
            * 매장 수령 선택 시, 환경 보호 정책상 매장 안에서는 다회용 컵을 제공해 드립니다.
          </p>
        </div>

        {/* 5. Coupons manager */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm">
          <h4 className="font-extrabold text-xs text-brand-dark border-b border-brand-cream-border pb-3 uppercase tracking-wider mb-3.5 select-none">할인 쿠폰 적용</h4>
          
          <div className="relative">
            <button
              onClick={() => setShowCouponModal(!showCouponModal)}
              className="w-full h-12 border border-brand-cream-border bg-brand-cream-bg/30 rounded-2xl px-4 flex items-center justify-between text-xs font-extrabold text-brand-dark hover:border-brand-primary/30 transition-all cursor-pointer"
              id="checkout-coupon-toggle"
            >
              <span className="flex items-center gap-1.5 text-xs">
                <Ticket className="w-4.5 h-4.5 text-brand-accent h-[18px]" />
                {activeCoupon ? `${activeCoupon.description} 적용 중` : '사용 가능한 쿠폰 선택하기'}
              </span>
              <span className="flex items-center gap-1">
                {activeCoupon && (
                  <span className="text-[10px] bg-brand-primary text-brand-cream-bg font-extrabold px-2 py-0.5 rounded-md border border-brand-primary">
                    {activeCoupon.discountType === 'percentage' ? `${activeCoupon.discountValue}% 할인` : `${activeCoupon.discountValue.toLocaleString()}원 할인`}
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-brand-muted" />
              </span>
            </button>

            {/* Dropdown Box of coupons */}
            <AnimatePresence>
              {showCouponModal && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-brand-cream-border shadow-xl overflow-hidden select-none"
                >
                  <div className="p-2.5 max-h-[180px] overflow-y-auto space-y-1.5">
                    {SAMPLE_COUPONS.map((coupon) => {
                      const isSelected = activeCoupon?.code === coupon.code;
                      return (
                        <button
                          key={coupon.code}
                          onClick={() => {
                            applyCoupon(isSelected ? null : coupon);
                            setShowCouponModal(false);
                          }}
                          className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected 
                              ? 'border-brand-primary bg-brand-light-green/40' 
                              : 'border-brand-cream-border hover:bg-brand-cream-bg/40'
                          }`}
                          id={`checkout-coupon-${coupon.code}`}
                        >
                          <div>
                            <div className="text-xs font-extrabold text-brand-dark">{coupon.description}</div>
                            <div className="text-[9.5px] text-brand-muted font-bold mt-0.5">코드: {coupon.code}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {isSelected ? (
                              <CheckCircle className="w-5 h-5 text-brand-primary fill-brand-light-green" />
                            ) : (
                              <span className="text-[10px] font-extrabold text-brand-primary bg-brand-light-green px-2 py-0.5 rounded">
                                {coupon.discountValue.toLocaleString()}
                                {coupon.discountType === 'percentage' ? '%' : '원'} DC
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 6. Payment methods configuration */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm select-none">
          <h4 className="font-extrabold text-xs text-brand-dark border-b border-brand-cream-border pb-3 uppercase tracking-wider mb-4">결제 수단 선택</h4>
          
          <div className="grid grid-cols-3 gap-2.5" id="checkout-payment-methods">
            {[
              { id: '신용카드', label: '신용카드', icon: CreditCard },
              { id: '간편결제', label: '간편결제', icon: Smartphone },
              { id: '현장결제', label: '현장결제', icon: Store },
            ].map((pm) => {
              const checked = paymentMethod === pm.id;
              const PMIcon = pm.icon;
              return (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`h-16 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-[11px] font-extrabold cursor-pointer ${
                    checked 
                      ? 'border-brand-primary bg-brand-light-green text-brand-dark' 
                      : 'border-brand-cream-border bg-brand-cream-bg/30 text-brand-muted hover:border-brand-primary/30'
                  }`}
                  id={`checkout-payment-method-${pm.id}`}
                >
                  <PMIcon className={`w-5 h-5 ${checked ? 'text-brand-primary' : 'text-brand-muted'}`} />
                  {pm.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Actual pricing summaries checkout block */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm select-none">
          <h4 className="font-extrabold text-xs text-brand-dark border-b border-brand-cream-border pb-3 uppercase tracking-wider mb-4">최종 결제 예정 내역</h4>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-semibold text-brand-muted">
              <span>주문 원가 합계</span>
              <span>{cartSums.subTotal.toLocaleString()}원</span>
            </div>
            {activeCoupon && (
              <div className="flex justify-between items-center text-xs font-semibold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 fill-rose-100" />
                  할인 혜택 ({activeCoupon.description})
                </span>
                <span>-{cartSums.couponDiscount.toLocaleString()}원</span>
              </div>
            )}
            <div className="border-t border-brand-cream-border pt-3.5 flex justify-between items-baseline">
              <span className="text-xs font-black text-brand-dark">최종 결제 금액</span>
              <span className="text-lg font-black text-brand-primary">
                {cartSums.finalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* Informative secure payment text */}
        <div className="flex items-center gap-2 justify-center py-2 select-none">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 h-[18px]" />
          <span className="text-[10px] text-brand-muted font-bold">준서카페 안전 주문 가이드를 준수합니다.</span>
        </div>

      </div>

      {/* 8. Bottom Sticky final CTA button */}
      <div className="sticky bottom-0 -mx-4 bg-white border-t border-brand-cream-border shadow-md z-40 select-none px-4 pt-3 pb-4 mt-6">
        <div className="max-w-md mx-auto px-4 pt-4 pb-6 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">주문하실 결제금액</span>
            <span className="text-lg font-black text-brand-dark">
              {cartSums.finalAmount.toLocaleString()}원
            </span>
          </div>

          <button
            onClick={handleSubmitOrder}
            className="flex-1 h-[50px] rounded-full bg-brand-primary text-white font-extrabold hover:bg-brand-dark transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 hover:shadow-lg"
            id="checkout-pay-cta"
          >
            {cartSums.finalAmount.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>

    </div>
  );
}
