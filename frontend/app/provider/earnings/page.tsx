"use client";

import React from "react";
import ProviderLayout from "@/components/provider/ProviderLayout";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Calendar, 
  TrendingUp,
  CreditCard,
  Banknote,
  MoreHorizontal
} from "lucide-react";

const transactions = [
  { id: "TXN-001", type: "Service Payment", date: "12 May, 2024", amount: "+₹2,499", status: "Completed", method: "Wallet" },
  { id: "TXN-002", type: "Withdrawal", date: "10 May, 2024", amount: "-₹5,000", status: "Processing", method: "Bank Transfer" },
  { id: "TXN-003", type: "Service Payment", date: "09 May, 2024", amount: "+₹899", status: "Completed", method: "UPI" },
  { id: "TXN-004", type: "Service Payment", date: "08 May, 2024", amount: "+₹1,200", status: "Completed", method: "Card" },
];

export default function EarningsPage() {
  return (
    <ProviderLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Earnings & Wallet</h1>
            <p className="text-slate-500 font-medium">Manage your payouts and view detailed transaction history.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download className="h-4 w-4" />
            Export Statement
          </button>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary rounded-[32px] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                <Wallet className="h-32 w-32" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Banknote className="h-4 w-4 text-primary/40" />
                  <h3 className="text-primary/70 text-sm font-medium uppercase tracking-widest">Available Balance</h3>
                </div>
                <p className="text-4xl font-black mb-10">₹12,450.80</p>
                <div className="mt-auto flex items-center gap-3">
                  <button className="flex-1 py-3.5 bg-white text-primary rounded-2xl font-black text-sm hover:bg-primary/5 transition-all shadow-lg">
                    Withdraw to Bank
                  </button>
                  <button className="p-3.5 bg-primary-dark/50 hover:bg-primary-dark text-white rounded-2xl transition-all border border-primary-light/30">
                    <CreditCard className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                    +24% this month
                  </span>
                </div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Lifetime Earnings</h3>
                <p className="text-3xl font-black text-slate-900">₹2,84,320</p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Jobs Done</span>
                  <span className="text-lg font-black text-slate-700">482</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Price</span>
                  <span className="text-lg font-black text-slate-700">₹589</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-200 flex flex-col">
            <h3 className="text-lg font-black mb-6">Linked Bank Account</h3>
            <div className="flex-1 space-y-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Banknote className="h-6 w-6 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-sm font-black">HDFC Bank Ltd.</p>
                    <p className="text-xs text-slate-500 font-medium">Savings Account</p>
                  </div>
                </div>
                <p className="text-sm font-bold tracking-widest text-slate-400">•••• •••• •••• 9821</p>
              </div>
              
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <p className="text-xs text-amber-500 font-bold leading-relaxed">
                  Payouts are processed within 24 hours of withdrawal request.
                </p>
              </div>
            </div>
            <button className="w-full mt-6 py-3.5 border border-white/20 hover:bg-white/5 rounded-2xl text-sm font-bold transition-all">
              Change Account
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Transaction History</h2>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-all">All</button>
              <button className="px-4 py-2 text-slate-400 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all">Withdrawals</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-black text-slate-900">{txn.id}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${txn.amount.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          {txn.amount.startsWith('+') ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{txn.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">{txn.date}</td>
                    <td className={`px-8 py-6 text-sm font-black ${txn.amount.startsWith('+') ? "text-emerald-600" : "text-slate-900"}`}>{txn.amount}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        txn.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-xs font-bold text-slate-400">{txn.method}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-slate-50/50 text-center">
            <button className="text-sm font-black text-primary hover:text-primary-dark uppercase tracking-widest">Load More Transactions</button>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
