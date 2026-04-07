import React from 'react';
import BannersOverview from '@/components/admin/banners/BannersOverview';
import { Banner } from '@/components/admin/banners/BannerCard';

const DUMMY_BANNERS: Banner[] = [
  { id: 1, title: 'Summer Special Clean', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=800', targetUrl: '/services/cleaning', isActive: true, expiresOn: '2025-06-30' },
  { id: 2, title: 'AC Refresh Promo', imageUrl: 'https://images.unsplash.com/photo-1590483734724-3453715c0e7b?auto=format&fit=crop&q=80&w=800', targetUrl: '/services/ac-repair', isActive: false, expiresOn: '2025-05-15' },
];

export default function AdminBannersPage() {
  // TODO: Fetch banners from API
  return <BannersOverview initialBanners={DUMMY_BANNERS} />;
}
