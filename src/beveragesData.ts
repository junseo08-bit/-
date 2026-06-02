/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Beverage, Category } from './types';

export const BEVERAGES: Beverage[] = [
  // COFFEE
  {
    id: 'b1',
    name: '아메리카노',
    category: 'coffee',
    price: 4500,
    description: '고품질 아라비카 원두를 천천히 로스팅하여 깊고 진한 에스프레소에 깨끗한 물을 더해 깔끔하면서도 풍부한 바디감을 느낄 수 있는 대표 커피입니다.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
    calories: 10,
    popular: true,
  },
  {
    id: 'b2',
    name: '카페라떼',
    category: 'coffee',
    price: 5000,
    description: '신선한 우유와 에스프레소 샷이 어우러져 한없이 부드럽고 촉촉하며 고소함이 입안 가득 맴도는 환상의 하모니를 선사합니다.',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
    calories: 180,
    popular: true,
  },
  {
    id: 'b3',
    name: '바닐라라떼',
    category: 'coffee',
    price: 5500,
    description: '달콤한 프리미엄 천연 바닐라 시럽과 고소한 에스프레소 라떼가 만나 은은하고 깊은 바닐라 향의 매력에 푹 빠질 수 있는 베스트셀러 음료입니다.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600',
    calories: 220,
    popular: true,
  },
  {
    id: 'b4',
    name: '카라멜마끼아또',
    category: 'coffee',
    price: 6000,
    description: '달콤한 바닐라 시럽과 우유 거품 위의 풍성하고 진한 홈메이드 카라멜 드리즐이 정통 에스프레소 샷과 완벽한 층을 이루어 시각과 미각을 사로잡습니다.',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=600',
    calories: 280,
    popular: false,
  },
  // ADE
  {
    id: 'b5',
    name: '레몬에이드',
    category: 'ade',
    price: 6000,
    description: '생 고당도 레몬을 통째로 착즙하여 상큼하고 비타민이 가득하며 청량한 탄산수가 만나 무더위를 날려 버리는 시원함을 마사지하듯 느끼게 해 줍니다.',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    calories: 120,
    popular: true,
  },
  {
    id: 'b6',
    name: '자몽에이드',
    category: 'ade',
    price: 6500,
    description: '신선한 붉은 자몽 원액과 부드러운 과육이 살아 있어 쌉싸름하면서도 입맛을 당기는 특유의 매력적인 달콤청량함이 일품인 대표 에이드 음료입니다.',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600',
    calories: 140,
    popular: false,
  },
  // SMOOTHIE
  {
    id: 'b7',
    name: '딸기스무디',
    category: 'smoothie',
    price: 6500,
    description: '당도 높은 리얼 국산 딸기를 듬뿍 담아 부드러운 우유 유크림과 함께 곱게 갈아내어 한 모금 음미할 때마다 생생한 딸기씨가 톡톡 씹히는 고급 스무디입니다.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600',
    calories: 310,
    popular: true,
  },
  {
    id: 'b8',
    name: '망고스무디',
    category: 'smoothie',
    price: 7000,
    description: '진한 열대 망고 과육의 풍미를 그대로 살려 얼음과 블렌딩하여 더욱 쫀득하고 시원하며, 이국적인 달콤함을 가장 차갑게 즐기는 방법입니다.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&q=80&w=600',
    calories: 340,
    popular: true,
  },
  // TEA
  {
    id: 'b9',
    name: '얼그레이티',
    category: 'tea',
    price: 5000,
    description: '싱그러운 실론 산 홍차 잎에 향긋하고 프레시한 이탈리아 천연 베르가못 시트러스 향을 입혀 따뜻하고 우아하게 우려낸 프리미엄 허브티입니다.',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    calories: 5,
    popular: false,
  },
  {
    id: 'b10',
    name: '캐모마일티',
    category: 'tea',
    price: 5500,
    description: '고소하고 달착지근한 국화 향이 심신을 부드럽게 안정시켜주며 카페인이 전혀 없어 남녀노소 언제나 편안하게 감성으로 채울 수 있는 티입니다.',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600',
    calories: 2,
    popular: false,
  }
];

export const CATEGORY_LABELS: Record<Category, string> = {
  coffee: '커피',
  ade: '에이드',
  smoothie: '스무디',
  tea: '티',
};

export interface CouponItem {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export const SAMPLE_COUPONS: CouponItem[] = [
  { code: 'WELCOME10', description: '첫 가입 환영 10% 쿠폰', discountType: 'percentage', discountValue: 10 },
  { code: 'COFFEE3000', description: '행복 카페 오픈 기념 3,000원 할인 쿠폰', discountType: 'fixed', discountValue: 3000 },
  { code: 'SPRING5', description: '산뜻한 봄맞이 5% 추가 할인 쿠폰', discountType: 'percentage', discountValue: 5 },
];
