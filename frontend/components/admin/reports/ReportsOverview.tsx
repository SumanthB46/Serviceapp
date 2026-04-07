"use client";

import React from 'react';
import ReportCard from './ReportCard';
import Chart from './Chart';
import { DollarSign, Users, Briefcase, CalendarCheck } from 'lucide-react';

interface ReportsOverviewProps {
  stats: any;
  revenueChartData: any;
  userChartData: any;
}

export default function ReportsOverview({ stats, revenueChartData, userChartData }: ReportsOverviewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight lowercase">
          analytics<span className="text-blue-600">.</span>
        </h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 italic">Platform Performance & Metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard title="Monthly Revenue" value={stats.revenue} icon={DollarSign} color="text-green-600" bg="bg-green-50" trend={14} />
        <ReportCard title="New Signups" value={stats.signups} icon={Users} color="text-blue-600" bg="bg-blue-50" trend={8} />
        <ReportCard title="Total Providers" value={stats.providers} icon={Briefcase} color="text-indigo-600" bg="bg-indigo-50" trend={5} />
        <ReportCard title="Completed Bookings" value={stats.bookings} icon={CalendarCheck} color="text-orange-600" bg="bg-orange-50" trend={-2.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Chart 
          title="Revenue Growth" 
          subtitle="Monthly breakdown of gross revenue" 
          labels={revenueChartData.labels} 
          data={revenueChartData.values} 
        />
        <Chart 
          title="User Acquisition" 
          subtitle="New customer signups per month" 
          labels={userChartData.labels} 
          data={userChartData.values} 
        />
      </div>
    </div>
  );
}
