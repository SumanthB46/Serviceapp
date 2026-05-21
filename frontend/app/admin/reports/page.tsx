"use client";

import React, { useEffect, useState } from 'react';
import ReportsOverview from '@/components/admin/reports/ReportsOverview';
import axios from 'axios';
import { API_URL } from '@/config/api';

const DEFAULT_REPORT_DATA = {
  stats: {
    revenue: "₹0",
    signups: "0",
    providers: "0",
    bookings: "0"
  },
  revenueChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [0, 0, 0, 0, 0, 0]
  },
  userChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [0, 0, 0, 0, 0, 0]
  }
};

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState(DEFAULT_REPORT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/reports/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <ReportsOverview 
      stats={reportData.stats}
      revenueChartData={reportData.revenueChart}
      userChartData={reportData.userChart}
    />
  );
}
