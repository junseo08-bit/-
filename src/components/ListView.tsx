/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { BEVERAGES, CATEGORY_LABELS } from '../beveragesData';
import { Category, Beverage, CartItemOptions } from '../types';
import { Search, Star, ShoppingCart, Info, RotateCcw, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ListView() {
  const { 
    navigate, 
    addToCart, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery 
  } = useCart();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Search computation
  const filteredBeverages = useMemo(() => {
    return BEVERAGES.filter((beverage) => {
      const matchCategory = selectedCategory === 'all' || beverage.category === selectedCategory;
      const matchSearch = beverage.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          beverage.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          CATEGORY_LABELS[beverage.category].toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleQuickAdd = (e: React.MouseEvent, beverage: Beverage) => {
    e.stopPropagation(); // Prevent card navigation
    
    // Default system options
    const defaultOptions: CartItemOptions = {
      size: 'Tall',
      ice: beverage.category === 'tea' || beverage.category === 'coffee' ? '보통' : '많이',
      sweetness: beverage.category === 'coffee' ? '0%' : '50%',
      shots: '기본',
      whipping: '추가 안 함',
    };

    addToCart(beverage, defaultOptions, 1);
    
    // Custom beautiful floating alert toast
    setToastMessage(`🎁 ${beverage.name}이(가) 기본 옵션으로 장바구니에 추가되었습니다!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const categoriesList: { value: Category | 'all'; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'coffee', label: '커피' },
    { value: 'ade', label: '에이드' },
    { value: 'smoothie', label: '스무디' },
    { value: 'tea', label: '티' },
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-brand-cream-bg text-brand-text min-h-[calc(100vh-4rem)] pb-24 px-4 font-sans relative">
      
      {/* 1. Header & Search Bar */}
      <div className="pt-5 pb-3">
        <form onSubmit={(e) => e.preventDefault()} className="relative">
          <input 
            type="text"
            placeholder="마시고 싶은 음료를 찾아보세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-10 bg-white border border-brand-cream-border rounded-xl text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-brand-muted/60"
            id="list-search-bar"
          />
          <Search className="w-4.5 h-4.5 text-brand-muted absolute left-4 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-[10px] text-brand-muted hover:text-brand-primary font-bold cursor-pointer"
              id="list-clear-search-btn"
            >
              지우기
            </button>
          )}
        </form>
      </div>

      {/* 2. Categories Tab Navigation bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 pt-1 no-scrollbar select-none" id="list-categories-tab">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 h-9 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                isActive 
                  ? 'bg-brand-dark border-brand-dark text-brand-cream-bg shadow-sm' 
                  : 'bg-white border-brand-cream-border text-brand-muted hover:border-brand-primary/30'
              }`}
              id={`list-category-tab-${cat.value}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Filter Metrics overview */}
      <div className="flex items-center justify-between text-xs text-brand-muted font-bold px-1 mb-4 select-none">
        <span>총 {filteredBeverages.length}개의 정성 가득한 음료</span>
        {searchQuery && (
          <span className="text-brand-primary">"{searchQuery}" 검색 결과</span>
        )}
      </div>

      {/* 4. Display Toast Confirmation */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[380px] bg-brand-dark text-white text-[11px] font-extrabold px-4 py-3.5 rounded-2xl shadow-xl z-50 flex items-center justify-between border border-brand-accent/30 gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="bg-brand-primary p-1 rounded-full"><Check className="w-3.5 h-3.5 text-white" /></span>
              <span className="leading-tight text-brand-cream-bg">{toastMessage}</span>
            </div>
            <button 
              onClick={() => navigate('cart')} 
              className="text-[10px] font-extrabold text-brand-accent hover:underline shrink-0 bg-brand-accent/10 px-2.5 py-1 rounded-lg border border-brand-accent/20 cursor-pointer"
            >
              장바구니 보기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Beverage Grid list */}
      {filteredBeverages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3.5 mb-8">
          {filteredBeverages.map((beverage, index) => (
            <motion.div 
              key={beverage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
              onClick={() => navigate('detail', beverage.id)}
              className="bg-brand-cream-card rounded-3xl overflow-hidden border border-brand-cream-border hover:border-brand-primary/30 hover:shadow-md transition-all flex flex-col group cursor-pointer"
              id={`list-item-${beverage.id}`}
            >
              {/* Product Thumbnail with overlay elements */}
              <div className="relative aspect-square w-full bg-slate-50 overflow-hidden shrink-0">
                <img 
                  src={beverage.image} 
                  alt={beverage.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Popularity badge or top rating tag */}
                {beverage.popular && (
                  <div className="absolute top-2.5 left-2.5 bg-brand-accent text-brand-dark px-1.8 py-0.5 rounded-md text-[8.5px] font-extrabold flex items-center gap-0.5 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5 fill-brand-dark text-brand-dark" />
                    인기
                  </div>
                )}

                <div className="absolute top-2.5 right-2.5 bg-brand-dark/75 text-brand-accent rounded-full text-[8.5px] px-1.5 py-0.5 font-extrabold flex items-center gap-0.5 backdrop-blur-[1.5px] shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-brand-accent text-brand-accent" />
                  {beverage.rating.toFixed(1)}
                </div>

                <div className="absolute bottom-2 left-2 bg-black/40 text-brand-cream-bg rounded-md text-[8.5px] px-2 py-0.5 font-semibold backdrop-blur-[1px]">
                  {beverage.calories} kcal
                </div>
              </div>

              {/* Card Meta details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-extrabold text-brand-muted tracking-wide block uppercase mb-1">
                    {CATEGORY_LABELS[beverage.category]}
                  </span>
                  <h5 className="font-extrabold text-sm text-brand-dark leading-tight group-hover:text-brand-primary transition-colors line-clamp-1">
                    {beverage.name}
                  </h5>
                  <p className="text-[10px] text-brand-muted mt-1 line-clamp-2 leading-relaxed min-h-[30px] font-medium">
                    {beverage.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-brand-cream-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-brand-dark">
                      {beverage.price.toLocaleString()}원
                    </span>
                    <span className="text-[9.5px] font-extrabold text-brand-primary bg-brand-light-green px-2 py-0.5 rounded-md border border-brand-primary/10">
                      신선한 재료
                    </span>
                  </div>

                  {/* Operational utility buttons inside card */}
                  <div className="grid grid-cols-2 gap-1.5 mt-3">
                    <button 
                      onClick={(e) => handleQuickAdd(e, beverage)}
                      className="h-8 rounded-full border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                      id={`list-quick-add-${beverage.id}`}
                    >
                      <ShoppingCart className="w-3 h-3" /> 담기
                    </button>
                    <button 
                      onClick={() => navigate('detail', beverage.id)}
                      className="h-8 rounded-full bg-brand-dark text-white hover:bg-brand-primary transition-all text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                      id={`list-view-detail-${beverage.id}`}
                    >
                      <Info className="w-3 h-3 text-brand-accent" /> 상세
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center select-none bg-white rounded-3xl border border-brand-cream-border shadow-sm mb-12">
          <div className="w-16 h-16 bg-brand-cream-bg rounded-full flex items-center justify-center mb-4">
            <RotateCcw className="w-7 h-7 text-brand-muted" />
          </div>
          <h4 className="font-extrabold text-md text-brand-dark">해당 결과가 없습니다</h4>
          <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">자세한 검색이나 다른 카테고리를 활용해 맛있는 음료들을 만나보세요.</p>
          <button
            onClick={handleResetFilters}
            className="mt-5 h-[38px] px-6 rounded-full bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all shadow cursor-pointer"
            id="list-reset-filter-btn"
          >
            필터 및 검색 초기화
          </button>
        </div>
      )}

    </div>
  );
}
