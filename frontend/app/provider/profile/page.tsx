"use client";

import React from "react";
import ProviderLayout from "@/components/provider/ProviderLayout";
import { 
  Camera, 
  ShieldCheck, 
  AlertCircle, 
  Languages, 
  Briefcase, 
  Save,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function ProfilePage() {
  const kycStatus: string = "Verified";

  return (
    <ProviderLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Management</h1>
          <p className="text-slate-500 font-medium">Update your professional details and check verification status.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & KYC */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="relative inline-block group cursor-pointer mb-4">
                <div className="h-32 w-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan" 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Aryan Sharma</h3>
              <p className="text-sm font-medium text-slate-500">Expert Cleaner</p>
            </div>

            {/* KYC Status Card */}
            <div className={`p-6 rounded-3xl border shadow-sm ${
              kycStatus === "Verified" ? "bg-emerald-50 border-emerald-100" :
              kycStatus === "Pending" ? "bg-blue-50 border-blue-100" :
              "bg-rose-50 border-rose-100"
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${
                  kycStatus === "Verified" ? "bg-emerald-500" :
                  kycStatus === "Pending" ? "bg-blue-500" :
                  "bg-rose-500"
                } text-white`}>
                  {kycStatus === "Verified" ? <CheckCircle2 className="h-5 w-5" /> :
                   kycStatus === "Pending" ? <ShieldCheck className="h-5 w-5" /> :
                   <XCircle className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${
                    kycStatus === "Verified" ? "text-emerald-900" :
                    kycStatus === "Pending" ? "text-blue-900" :
                    "text-rose-900"
                  }`}>KYC {kycStatus}</h4>
                  <span className="text-xs font-medium opacity-70">Identity Verified</span>
                </div>
              </div>
              {kycStatus === "Rejected" && (
                <div className="p-3 bg-white/50 rounded-xl border border-rose-100">
                  <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Reason:</p>
                  <p className="text-xs text-rose-700 font-medium">Document photo is blurred. Please upload a clear photo of your Aadhaar card.</p>
                </div>
              )}
              {kycStatus === "Verified" && (
                <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                  Your profile is fully verified. You can now accept high-value bookings and withdraw earnings.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Aryan Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience (Years)</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="number" 
                        defaultValue="5"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bio / Description</label>
                  <textarea 
                    rows={4}
                    defaultValue="Professional deep cleaning expert with over 5 years of experience in residential and commercial spaces. Specializing in sanitation and allergen-free cleaning."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Languages Spoken</label>
                  <div className="relative">
                    <Languages className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      defaultValue="English, Hindi, Punjabi"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Separate with commas (e.g. English, Hindi)</p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button type="button" className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">
                    Discard Changes
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Document Verification Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Documents</h3>
                <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-lg uppercase tracking-wider">Aadhaar & PAN</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                  <AlertCircle className="h-8 w-8 text-slate-300" />
                  <span className="text-sm font-bold text-slate-500">Update Aadhaar Card</span>
                </div>
                <div className="p-4 rounded-2xl border-2 border-emerald-500 border-dashed flex flex-col items-center justify-center gap-3 bg-emerald-50 transition-all">
                  <ShieldCheck className="h-8 w-8 text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-700">PAN Card Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
