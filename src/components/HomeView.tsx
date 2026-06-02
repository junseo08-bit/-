/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BEVERAGES, CATEGORY_LABELS } from '../beveragesData';
import { Search, ChevronRight, Star, Heart, Coffee, CupSoda, Leaf, GlassWater, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomeView() {
  const { navigate, setSearchQuery } = useCart();
  const [localSearch, setLocalSearch] = useState('');

  const popularBeverages = BEVERAGES.filter(b => b.popular);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
      navigate('list');
    }
  };

  const handleCategoryClick = (category: 'coffee' | 'ade' | 'smoothie' | 'tea') => {
    setSearchQuery('');
    navigate('list', null, category);
  };

  // Setup visual assets for the categories
  const categories = [
    { id: 'coffee', label: '커피', icon: Coffee, desc: '진한 에스프레소', color: 'bg-[#00704a]/10 text-[#00704a]' },
    { id: 'ade', label: '에이드', icon: CupSoda, desc: '상큼한 톡톡 스파클링', color: 'bg-[#cba258]/10 text-amber-700' },
    { id: 'smoothie', label: '스무디', icon: GlassWater, desc: '시원한 과일 블렌딩', color: 'bg-rose-50 text-rose-600' },
    { id: 'tea', label: '티', icon: Leaf, desc: '향긋한 잎차 에센스', color: 'bg-emerald-50 text-emerald-600' },
  ] as const;

  return (
    <div className="w-full max-w-md mx-auto bg-brand-cream-bg text-brand-text min-h-[calc(100vh-4rem)] pb-24 font-sans px-4">
      
      {/* 1. Welcome & Search Block */}
      <div className="pt-6 pb-2 select-none">
        <h2 className="text-2xl font-extrabold text-brand-dark leading-tight flex items-center gap-1 font-soft">
          준서카페에 오신 것을
        </h2>
        <h2 className="text-2xl font-extrabold text-brand-dark tracking-tight font-soft">
          환영합니다! <span className="inline-block animate-wave text-3xl">☕</span>
        </h2>
        <p className="font-cute text-base text-brand-muted mt-1.5 font-bold tracking-wide">
          따뜻하고 부드러운 오늘 하루, 맛있는 음료와 함께하세요.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="my-4 relative">
        <input 
          type="text"
          placeholder="좋아하는 음료를 검색해보세요"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-white border border-brand-cream-border rounded-2xl text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent placeholder:text-brand-muted/60"
          id="home-search-input"
        />
        <Search className="w-5 h-5 text-brand-muted absolute left-4 top-3.5" />
        <button 
          type="submit"
          className="absolute right-3.5 top-3 text-xs bg-brand-primary text-white font-bold h-6 px-3 rounded-full hover:bg-brand-dark transition-all scale-95 opacity-80"
          id="home-search-submit-btn"
        >
          검색
        </button>
      </form>

      {/* 2. Recommended Promotion Banner (Starbucks Style) */}
      <div className="relative mt-6 rounded-3xl overflow-hidden shadow-md bg-gradient-to-br from-brand-dark to-[#102d24] text-white p-5 flex items-center justify-between min-h-[145px]">
        {/* Banner backgrounds decoration */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-primary/20 rounded-full blur-2xl"></div>
          <div className="absolute top-4 right-12 w-12 h-12 bg-brand-accent/20 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center max-w-[65%]">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent text-[10px] font-extrabold tracking-wider w-fit border border-brand-accent/30 mb-2">
            <Sparkles className="w-3 h-3" /> SEASON SPECIAL
          </div>
          <h3 className="text-base font-extrabold leading-snug tracking-tight text-brand-cream-bg drop-shadow-sm">
            리얼 허니 골든 망고 스무디
          </h3>
          <p className="text-[10px] text-brand-cream-bg/75 mt-1 leading-relaxed">
            프레시 망고 과육이 쏟아지는 시그니처 썸머 블렌드! 시즌 한정 품격을 경험해보세요.
          </p>
          <button 
            onClick={() => navigate('detail', 'b8')}
            className="mt-3 text-[11px] font-bold bg-brand-accent hover:bg-brand-accent/90 text-brand-dark h-[28px] px-3.5 rounded-full transition-all flex items-center justify-between gap-1 w-fit cursor-pointer shadow-sm active:scale-95"
            id="home-banner-btn"
          >
            지금 주문하기 <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        <div className="relative z-10 w-[30%] h-24 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&q=80&w=260" 
            alt="Mango Smoothie Promotion" 
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-brand-accent transform -rotate-6 hover:rotate-0 transition-transform duration-300"
          />
        </div>
      </div>

      {/* 3. Category Carousel Grid (4 circular items) */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-1 mb-3">
          <h4 className="font-extrabold text-base text-brand-dark">음료 카테고리</h4>
          <button 
            onClick={() => handleCategoryClick('coffee')}
            className="text-[11px] font-bold text-brand-primary flex items-center gap-0.5 hover:underline cursor-pointer"
            id="home-all-categories-btn"
          >
            메뉴 전체보기 <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center cursor-pointer group"
                id={`home-category-${cat.id}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${cat.color} group-hover:scale-105 active:scale-95 border-2 border-transparent hover:border-brand-accent/30`}>
                  <IconComponent className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-[11px] font-extrabold text-brand-dark mt-2 group-hover:text-brand-primary transition-colors">
                  {cat.label}
                </span>
                <span className="text-[8px] font-semibold text-brand-muted text-center leading-none mt-0.5 scale-90 whitespace-nowrap opacity-75">
                  {cat.id === 'coffee' ? '4종' : cat.id === 'ade' ? '2종' : cat.id === 'smoothie' ? '2종' : '2종'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. Popular Beverage List */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-1 mb-4">
          <h4 className="font-extrabold text-md text-brand-dark flex items-center gap-1.5 font-soft">
            준서카페 시그니처 인기 메뉴 <span className="text-sm">🔥</span>
          </h4>
        </div>

        <div className="space-y-4">
          {popularBeverages.map((beverage, i) => (
            <motion.div 
              key={beverage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              onClick={() => navigate('detail', beverage.id)}
              className="bg-white rounded-3xl p-3 border border-brand-cream-border hover:border-brand-primary/30 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-all group cursor-pointer active:scale-[0.99]"
              id={`home-popular-item-${beverage.id}`}
            >
              {/* Image Container with star rating and heart overlay */}
              <div className="relative w-20 h-20 bg-brand-cream-bg rounded-2xl overflow-hidden shrink-0">
                <img 
                  src={beverage.image} 
                  alt={beverage.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-1.5 left-1.5 bg-brand-dark/70 text-brand-accent rounded-full text-[8px] px-1.5 py-0.5 font-extrabold flex items-center gap-0.5 backdrop-blur-[1px]">
                  <Star className="w-2.5 h-2.5 fill-brand-accent text-brand-accent" />
                  {beverage.rating.toFixed(1)}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between h-20">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold text-brand-primary px-1.5 py-0.5 rounded-md bg-[#00704a]/7 border border-brand-primary/10 tracking-wide uppercase">
                      {CATEGORY_LABELS[beverage.category]}
                    </span>
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-100 group-hover:fill-rose-400 transition-colors" />
                  </div>
                  <h5 className="font-extrabold text-sm text-brand-dark mt-1 group-hover:text-brand-primary transition-colors truncate">
                    {beverage.name}
                  </h5>
                  <p className="text-[10px] text-brand-muted truncate mt-0.5">
                    {beverage.description}
                  </p>
                </div>
                
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="text-xs text-brand-muted font-bold">
                    {beverage.calories} kcal
                  </span>
                  <span className="text-xs text-brand-dark font-extrabold">
                    {beverage.price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
