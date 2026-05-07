"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ChevronDown, 
  UserCircle, 
  Camera, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Briefcase,
  Mail,
  Phone,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Banknote,
  Activity,
  Edit3,
  Save,
  X
} from "lucide-react";
import axios from "axios";
import { API_URL } from '@/config/api';

export default function ProviderProfileForm() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit states
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);

  // User Table Data
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    profile_image: "",
  });

  // Provider Table Data
  const [providerFormData, setProviderFormData] = useState({
    availability_status: 'offline',
    aadhar_last4: '',
    bank_details: {
      account_holder_name: '',
      account_number_last4: '',
      ifsc_code: '',
      bank_name: '',
      branch: ''
    }
  });

  // Original data for cancellation
  const [originalUser, setOriginalUser] = useState<any>(null);
  const [originalProvider, setOriginalProvider] = useState<any>(null);

  const getProfileImageUrl = (path: string, name: string) => {
    if (!path) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'Provider'}`;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const baseUrl = API_URL.replace('/api', '');
    const cleanPath = path.replace(/\\/g, '/');
    return `${baseUrl}/${cleanPath}`;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchProfile = async (authToken: string) => {
    try {
      setLoading(true);
      // Fetch User details
      const userRes = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (userRes.data) {
        const u = userRes.data;
        const initialUser = {
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          gender: u.gender || "",
          profile_image: u.profile_image || "",
        };
        setUserFormData(initialUser);
        setOriginalUser(initialUser);
      }

      // Fetch Provider details
      const providerRes = await axios.get(`${API_URL}/providers/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (providerRes.data) {
        const p = providerRes.data;
        const initialProvider = {
          availability_status: p.availability_status || 'offline',
          aadhar_last4: p.aadhar_last4 || '',
          bank_details: {
            account_holder_name: p.bank_details?.account_holder_name || '',
            account_number_last4: p.bank_details?.account_number_last4 || '',
            ifsc_code: p.bank_details?.ifsc_code || '',
            bank_name: p.bank_details?.bank_name || '',
            branch: p.bank_details?.branch || ''
          }
        };
        setProviderFormData(initialProvider);
        setOriginalProvider(initialProvider);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProviderFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setProviderFormData({ ...providerFormData, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserFormData({ ...userFormData, profile_image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUserChanges = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/users/me`, userFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserFormData(res.data);
      setOriginalUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setIsEditingUser(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update basic profile");
    } finally {
      setLoading(false);
    }
  };

  const saveProviderChanges = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/providers/me`, providerFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviderFormData(res.data);
      setOriginalProvider(res.data);
      setIsEditingProvider(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update professional profile");
    } finally {
      setLoading(false);
    }
  };

  const cancelUserEdit = () => {
    setUserFormData(originalUser);
    setIsEditingUser(false);
  };

  const cancelProviderEdit = () => {
    setProviderFormData(originalProvider);
    setIsEditingProvider(false);
  };

  if (loading && !originalUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
        
        {/* SECTION 1: Profile & Basic Details (USER Table) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-[#1D2B83] to-[#2E3BA1] relative">
            <div className="absolute -bottom-16 left-8 sm:left-12">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-lg">
                  <img 
                    src={getProfileImageUrl(userFormData.profile_image, userFormData.name)} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                {isEditingUser && (
                  <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-slate-50 transition-all border border-slate-100">
                    <Camera size={18} className="text-[#1D2B83]" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>
            
            {/* User Edit Toggle */}
            <div className="absolute bottom-4 right-8">
               <button 
                onClick={() => isEditingUser ? saveUserChanges() : setIsEditingUser(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${isEditingUser ? 'bg-emerald-500 text-white' : 'bg-white text-[#1D2B83] hover:scale-105'}`}
               >
                 {isEditingUser ? <><Save size={14} /> Save Info</> : <><Edit3 size={14} /> Edit Identity</>}
               </button>
               {isEditingUser && (
                 <button onClick={cancelUserEdit} className="ml-2 p-2.5 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all backdrop-blur-md">
                   <X size={16} />
                 </button>
               )}
            </div>
          </div>

          <div className="pt-20 pb-10 px-8 sm:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-50 pb-8">
              <div className="space-y-1">
                <input 
                  name="name"
                  value={userFormData.name}
                  onChange={handleUserChange}
                  readOnly={!isEditingUser}
                  className={`text-3xl font-black tracking-tight focus:outline-none w-full max-w-md ${isEditingUser ? 'text-blue-600 bg-blue-50/50 rounded-lg px-2' : 'text-slate-900 bg-transparent'}`}
                  placeholder="Set your name"
                />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Professional Identity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className={`space-y-1.5 p-4 rounded-2xl border transition-all ${isEditingUser ? 'bg-blue-50/30 border-blue-100' : 'bg-slate-50 border-slate-100/50'}`}>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={12} className="text-blue-500" /> Business Email
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={userFormData.email}
                  onChange={handleUserChange}
                  readOnly={!isEditingUser}
                  className="w-full bg-transparent text-sm font-bold text-slate-700 focus:outline-none"
                />
              </div>
              <div className={`space-y-1.5 p-4 rounded-2xl border transition-all ${isEditingUser ? 'bg-blue-50/30 border-blue-100' : 'bg-slate-50 border-slate-100/50'}`}>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={12} className="text-blue-500" /> Primary Contact
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={userFormData.phone}
                  onChange={handleUserChange}
                  readOnly={!isEditingUser}
                  className="w-full bg-transparent text-sm font-bold text-slate-700 focus:outline-none"
                />
              </div>
              <div className={`space-y-1.5 p-4 rounded-2xl border transition-all ${isEditingUser ? 'bg-blue-50/30 border-blue-100' : 'bg-slate-50 border-slate-100/50'}`}>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <UserCircle size={12} className="text-blue-500" /> Gender
                </label>
                <select 
                  name="gender"
                  value={userFormData.gender}
                  onChange={handleUserChange}
                  disabled={!isEditingUser}
                  className="w-full bg-transparent text-sm font-bold text-slate-700 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Choose Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: Split Layout (PROVIDER Table & Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Professional Details (PROVIDER Table) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sm:p-10 relative">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-wider flex items-center gap-3">
                  <ShieldCheck className="text-blue-600" size={24} />
                  Professional Status
                </h2>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => isEditingProvider ? saveProviderChanges() : setIsEditingProvider(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isEditingProvider ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                   >
                     {isEditingProvider ? <><Save size={12} /> Update Professional</> : <><Edit3 size={12} /> Edit Details</>}
                   </button>
                   {isEditingProvider && (
                      <button onClick={cancelProviderEdit} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all">
                        <X size={14} />
                      </button>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Identity Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aadhar Verification</p>
                      <p className="text-sm font-bold text-slate-700">XXXX-XXXX-{providerFormData.aadhar_last4 || '0000'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
                      <p className={`text-sm font-bold uppercase tracking-tight ${providerFormData.availability_status === 'available' ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {providerFormData.availability_status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className={`rounded-[2rem] p-6 border transition-all ${isEditingProvider ? 'bg-blue-50/30 border-blue-100' : 'bg-[#F8FAFC] border-slate-100'}`}>
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                    <Banknote size={14} className="text-blue-600" /> Settlement
                  </h3>
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Bank Name</p>
                        <input 
                          name="bank_details.bank_name"
                          value={providerFormData.bank_details.bank_name}
                          onChange={handleProviderChange}
                          readOnly={!isEditingProvider}
                          className="w-full bg-transparent text-xs font-black text-slate-700 focus:outline-none"
                          placeholder="Bank Name"
                        />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">IFSC Code</p>
                        <input 
                          name="bank_details.ifsc_code"
                          value={providerFormData.bank_details.ifsc_code}
                          onChange={handleProviderChange}
                          readOnly={!isEditingProvider}
                          className="w-full bg-transparent text-xs font-black text-slate-700 focus:outline-none"
                          placeholder="IFSC Code"
                        />
                     </div>
                     <div className="pt-2 border-t border-slate-200/50">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">A/C Number (Last 4)</p>
                        <p className="text-xs font-black text-slate-700">•••• •••• {providerFormData.bank_details.account_number_last4 || 'XXXX'}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Cards (Stats & Tips) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#1D2B83] rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <Activity className="mb-6 opacity-80" size={32} />
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-2">Partner Rank</p>
              <h3 className="text-4xl font-black mb-2 italic">Silver</h3>
              <p className="text-[11px] text-blue-100 font-bold leading-relaxed">
                Complete 10 more bookings to unlock Gold Status.
              </p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em]">Health</h3>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Stable</span>
              </div>
              <div className="space-y-4">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-normal">
                  Professional documents are 85% verified.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
  );
}
