/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { BEVERAGES, CATEGORY_LABELS } from '../beveragesData';
import { SizeOption, IceOption, SweetnessOption, ShotOption, WhippingOption, CartItemOptions } from '../types';
import { Star, Flame, Plus, Minus, Check, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DetailView() {
  const { navigate, selectedBeverageId, addToCart } = useCart();
  
  // Find selected beverage
  const beverage = useMemo(() => {
    return BEVERAGES.find(b => b.id === selectedBeverageId) || BEVERAGES[0];
  }, [selectedBeverageId]);

  // States for beverage configurations
  const [size, setSize] = useState<SizeOption>('Tall');
  const [ice, setIce] = useState<IceOption>('보통');
  const [sweetness, setSweetness] = useState<SweetnessOption>('50%');
  const [shots, setShots] = useState<ShotOption>('기본');
  const [whipping, setWhipping] = useState<WhippingOption>('추가 안 함');
  const [quantity, setQuantity] = useState<number>(1);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Configuration options price calculator
  const optionSummaryDetails = useMemo(() => {
    let extra = 0;
    let sizeText = '기본가';
    let shotText = '';

    if (size === 'Grande') {
      extra += 500;
      sizeText = '+500원';
    } else if (size === 'Venti') {
      extra += 1000;
      sizeText = '+1,000원';
    }

    if (shots.includes('1샷')) {
      extra += 500;
      shotText = '+500원';
    } else if (shots.includes('2샷')) {
      extra += 1000;
      shotText = '+1,000원';
    }

    const singlePrice = beverage.price + extra;
    const totalPrice = singlePrice * quantity;

    return {
      singlePrice,
      totalPrice,
      extra,
      sizeText,
      shotText
    };
  }, [size, shots, quantity, beverage]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(q => q + 1);
  };

  const handleAddToCart = () => {
    const selectedOptions: CartItemOptions = {
      size,
      ice,
      sweetness,
      shots,
      whipping,
    };

    addToCart(beverage, selectedOptions, quantity);
    
    // Popup toast alert
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      navigate('list'); // Redirect to List
    }, 1800);
  };

  // Option lists
  const sizes: { name: SizeOption; label: string; desc: string }[] = [
    { name: 'Tall', label: 'Tall (톨)', desc: '355ml / 기본가' },
    { name: 'Grande', label: 'Grande (그란데)', desc: '473ml / +500원' },
    { name: 'Venti', label: 'Venti (벤티)', desc: '591ml / +1,000원' },
  ];

  const iceOptions: IceOption[] = ['없음', '적게', '보통', '많이'];
  
  const sweetnessOptions: SweetnessOption[] = ['0%', '30%', '50%', '100%'];
  
  const shotOptions: { name: ShotOption; desc: string }[] = [
    { name: '기본', desc: '기본 원두 적용' },
    { name: '1샷 추가 (+500원)', desc: '중량감 강화' },
    { name: '2샷 추가 (+1000원)', desc: '강한 오리지널 향' },
  ];

  const whippingOptions: WhippingOption[] = ['추가', '추가 안 함'];

  return (
    <div className="w-full max-w-md mx-auto bg-brand-cream-bg text-brand-text min-h-[calc(100vh-4rem)] pb-36 px-4 font-sans relative">
      
      {/* 1. Back button for direct access / Header spacing */}
      <div className="py-3 flex items-center gap-2 select-none">
        <button 
          onClick={() => navigate('list')}
          className="flex items-center gap-1 text-xs text-brand-muted font-bold hover:text-brand-primary py-1"
          id="detail-back-btn"
        >
          <ArrowLeft className="w-4 h-4" /> 음료 목록으로 돌아가기
        </button>
      </div>

      {/* 2. Interactive Toast notifications spacer */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[380px] bg-[#00704a] text-white text-xs font-bold p-4 rounded-2xl shadow-2xl z-50 flex items-center justify-center gap-2.5 border border-brand-accent/20"
          >
            <div className="bg-white/20 p-1.5 rounded-full">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span>음료 장바구니 추가가 완료되었습니다!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Hero card with large photo */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border border-brand-cream-border shadow-sm mb-6"
        id="detail-hero-card"
      >
        <div className="relative h-60 w-full bg-slate-50">
          <img 
            src={beverage.image} 
            alt={beverage.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-brand-dark/80 text-brand-accent px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-[2px]">
            <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />
            {beverage.rating.toFixed(1)} 평점
          </div>
          <div className="absolute bottom-4 right-4 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-white" />
            {beverage.calories} kcal (칼로리)
          </div>
        </div>

        {/* Text descriptions */}
        <div className="p-5">
          <span className="text-[10px] font-extrabold text-brand-primary tracking-wider bg-brand-light-green border border-brand-primary/10 px-2.5 py-1 rounded-md uppercase">
            {CATEGORY_LABELS[beverage.category]}
          </span>
          <h3 className="text-xl font-extrabold text-brand-dark mt-2.5">{beverage.name}</h3>
          
          <div className="text-lg font-extrabold text-brand-dark mt-1">
            {beverage.price.toLocaleString()}원
          </div>
          
          <p className="text-xs text-brand-muted mt-3.5 leading-relaxed font-medium">
            {beverage.description}
          </p>
        </div>
      </motion.div>

      {/* 4. Option Selectors Blocks */}
      <div className="space-y-6">
        
        {/* 사이즈 선택 (Sizes selector) */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm">
          <h4 className="font-extrabold text-sm text-brand-dark mb-3 flex items-center justify-between">
            <span>사이즈 선택</span>
            <span className="text-[10px] text-brand-primary font-bold">필수</span>
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {sizes.map((s) => {
              const checked = size === s.name;
              return (
                <button
                  key={s.name}
                  onClick={() => setSize(s.name)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    checked 
                      ? 'border-brand-primary bg-brand-light-green/40' 
                      : 'border-brand-cream-border bg-brand-cream-bg/30 text-brand-muted hover:border-brand-primary/30'
                  }`}
                  id={`detail-size-btn-${s.name}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Visual cup representing different sizes */}
                    <div className="flex items-end justify-center w-8 h-8 rounded-full bg-white border border-brand-cream-border">
                      <div className={`bg-brand-primary/80 rounded-t-sm rounded-b-md transition-all ${
                        s.name === 'Tall' ? 'w-3 h-4' : s.name === 'Grande' ? 'w-4.2 h-5.5' : 'w-5.2 h-7'
                      }`} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${checked ? 'text-brand-dark' : 'text-brand-text'}`}>{s.label}</div>
                      <div className="text-[10px] text-brand-muted font-semibold mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                  <div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      checked ? 'border-brand-primary bg-[#00704a]' : 'border-brand-cream-border bg-white'
                    }`}>
                      {checked && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 얼음 선택 (Ice levels) */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm">
          <h4 className="font-extrabold text-sm text-brand-dark mb-3 flex items-center justify-between">
            <span>얼음 선택</span>
            <span className="text-[10px] text-brand-primary font-bold">무료 선택</span>
          </h4>
          <div className="grid grid-cols-4 gap-1.5" id="detail-ice-grid">
            {iceOptions.map((opt) => {
              const checked = ice === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setIce(opt)}
                  className={`h-10 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    checked 
                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm' 
                      : 'bg-brand-cream-bg/30 border-brand-cream-border text-brand-muted hover:border-brand-primary/30'
                  }`}
                  id={`detail-ice-btn-${opt}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* 당도 선택 (Sweetness levels) */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm">
          <h4 className="font-extrabold text-sm text-brand-dark mb-3 flex items-center justify-between">
            <span>당도 선택</span>
            <span className="text-[10px] text-brand-primary font-bold">무료 선택</span>
          </h4>
          <div className="grid grid-cols-4 gap-1.5" id="detail-sweetness-grid">
            {sweetnessOptions.map((opt) => {
              const checked = sweetness === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setSweetness(opt)}
                  className={`h-10 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    checked 
                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm' 
                      : 'bg-brand-cream-bg/30 border-brand-cream-border text-brand-muted hover:border-brand-primary/30'
                  }`}
                  id={`detail-sweetness-btn-${opt}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* 샷 추가 (Shot select options) */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm">
          <h4 className="font-extrabold text-sm text-brand-dark mb-3 flex items-center justify-between">
            <span>샷 추가</span>
            <span className="text-[10px] text-brand-primary font-bold">추가 가격 적용</span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {shotOptions.map((option) => {
              const checked = shots === option.name;
              return (
                <button
                  key={option.name}
                  onClick={() => setShots(option.name)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                    checked 
                      ? 'border-brand-primary bg-brand-light-green/40' 
                      : 'border-brand-cream-border bg-brand-cream-bg/30 text-brand-muted hover:border-brand-primary/30'
                  }`}
                  id={`detail-shot-btn-${option.name}`}
                >
                  <div>
                    <div className={`text-xs font-bold ${checked ? 'text-brand-dark' : 'text-brand-text'}`}>
                      {option.name}
                    </div>
                    <div className="text-[9.5px] text-brand-muted mt-0.5 font-semibold">{option.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    checked ? 'border-brand-primary bg-[#00704a]' : 'border-brand-cream-border bg-white'
                  }`}>
                    {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 휘핑크림 선택 (Whipping cream) */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm">
          <h4 className="font-extrabold text-sm text-brand-dark mb-3 flex items-center justify-between">
            <span>휘핑크림</span>
            <span className="text-[10px] text-brand-primary font-bold">무료 선택</span>
          </h4>
          <div className="grid grid-cols-2 gap-2" id="detail-whipping-grid">
            {whippingOptions.map((opt) => {
              const checked = whipping === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setWhipping(opt)}
                  className={`h-11 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    checked 
                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm' 
                      : 'bg-brand-cream-bg/30 border-brand-cream-border text-brand-muted hover:border-brand-primary/30'
                  }`}
                  id={`detail-whipping-btn-${opt}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* 수량 선택 (Quantity steps counter) */}
        <div className="bg-white rounded-3xl p-5 border border-brand-cream-border shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-brand-dark">수량 선택</h4>
            <p className="text-[10px] text-brand-muted mt-0.5">원하시는 주문 수량을 지정하세요</p>
          </div>
          <div className="flex items-center gap-1 bg-brand-cream-bg p-1 rounded-2xl border border-brand-cream-border select-none">
            <button 
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                quantity <= 1 ? 'text-brand-muted/30' : 'text-brand-dark hover:bg-white hover:shadow-sm'
              }`}
              id="detail-qty-decrease-btn"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="w-8 text-center text-xs font-black text-brand-dark">{quantity}</span>
            <button 
              onClick={handleIncrease}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-brand-dark hover:bg-white hover:shadow-sm transition-all cursor-pointer"
              id="detail-qty-increase-btn"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>

      {/* 5. Bottom block - Sticky live computation and 50px CTA pill */}
      <div className="sticky bottom-0 -mx-4 bg-white border-t border-brand-cream-border shadow-md z-40 select-none px-4 pb-5 pt-3 mt-6">
        <div className="max-w-md mx-auto px-4 pt-4 pb-6 flex flex-col gap-3">
          
          {/* Quick options summarize line */}
          <div className="flex items-center justify-between text-xs font-bold text-brand-muted">
            <span className="flex items-center gap-1.5">
              <span>{beverage.name}</span>
              <span className="text-[10px] bg-brand-light-green text-brand-primary px-1.5 py-0.5 rounded">
                {size} / 얼음:{ice} / 당도:{sweetness}
              </span>
            </span>
            <span className="text-brand-dark">
              수량: {quantity}개
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">실시간 총 결제금액</span>
              <span className="text-lg font-black text-brand-dark animate-all">
                {optionSummaryDetails.totalPrice.toLocaleString()}원
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 h-[50px] rounded-full bg-brand-primary text-white font-extrabold hover:bg-brand-dark transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 hover:shadow-lg"
              id="detail-add-to-cart-cta"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-brand-accent h-[18px]" />
              장바구니 담기
            </button>
          </div>
          
        </div>
      </div>

    </div>
  );
}
