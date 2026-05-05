"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, Plus, Minus, Home, Brush, Hammer, Zap, Trees, Monitor,
  User as UserIcon, Package, GraduationCap, ChevronLeft, ChevronRight,
  ArrowLeft, Upload, FileText, IndianRupee, Briefcase, Award, Camera,
  ShieldCheck, Landmark, CreditCard, Lock, Clock, MapPin, Calendar, Info,
  UserCircle, Contact2
} from "lucide-react";
import { API_URL } from '@/config/api';

interface Category {
  _id: string;
  category_name: string;
  icon: string;
  description: string;
}

interface Service {
  _id: string;
  service_name: string;
  category_id: string;
}

interface LocationData {
  _id: string;
  name: string;
  type: string;
}

interface Availability {
  day: string;
  start_time: string;
  end_time: string;
}

interface ServiceDetail {
  experience: number;
  price: number;
  skills: string;
  selectedLocations: string[];
  availability: Availability[];
  documents: DocUpload[];
}

interface DocUpload {
  doc_type: string;
  file?: File;
  file_url?: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ProviderServiceSelection() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [servicesMap, setServicesMap] = useState<Record<string, Service[]>>({});
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  // Steps: 0 (Categories), 1 (Services), 2 (Prof. Details), 3 (Identity & Bank)
  const [currentStep, setCurrentStep] = useState(0);

  // Step 2 form states
  const [serviceDetails, setServiceDetails] = useState<Record<string, ServiceDetail>>({});

  // Step 3 form states
  const [aadharId, setAadharId] = useState("");
  const [idProof, setIdProof] = useState<DocUpload>({ doc_type: 'Government ID' });
  const [selfie, setSelfie] = useState<DocUpload>({ doc_type: 'Selfie' });
  const [bankDetails, setBankDetails] = useState({
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    branch: ""
  });

  // Carousel state for categories
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (!storedUserStr) {
      router.push("/signup");
      return;
    }
    setUser(JSON.parse(storedUserStr));
    fetchCategories();
    fetchLocations();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      if (res.ok) setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_URL}/locations`);
      const data = await res.json();
      if (res.ok) setLocations(data.filter((l: any) => l.status === 'active'));
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  };

  const fetchServicesForCategory = async (categoryId: string) => {
    if (servicesMap[categoryId]) return;
    try {
      const res = await fetch(`${API_URL}/services?category_id=${categoryId}`);
      const data = await res.json();
      if (res.ok) {
        setServicesMap(prev => ({ ...prev, [categoryId]: data }));
      }
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds(prev => {
      const isSelected = prev.includes(categoryId);
      if (isSelected) {
        const categoryServices = servicesMap[categoryId] || [];
        const serviceIdsToRemove = categoryServices.map(s => s._id);
        setSelectedServices(curr => curr.filter(id => !serviceIdsToRemove.includes(id)));
        if (prev.length === 1) setCurrentStep(0);
        return prev.filter(id => id !== categoryId);
      } else {
        fetchServicesForCategory(categoryId);
        return [...prev, categoryId];
      }
    });
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const isSelected = prev.includes(serviceId);
      const next = isSelected ? prev.filter(id => id !== serviceId) : [...prev, serviceId];
      if (!isSelected && !serviceDetails[serviceId]) {
        setServiceDetails(curr => ({
          ...curr,
          [serviceId]: {
            experience: 0,
            price: 0,
            skills: "",
            selectedLocations: [],
            availability: [{ day: "Monday", start_time: "09:00", end_time: "18:00" }],
            documents: []
          }
        }));
      }
      return next;
    });
  };

  const handleServiceDetailChange = (serviceId: string, field: keyof ServiceDetail, value: any) => {
    setServiceDetails(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [field]: value }
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      if (selectedCategoryIds.length === 0) return setError("Please select at least one category.");
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (selectedServices.length === 0) return setError("Please select at least one service.");

      const validCategoryIds = selectedCategoryIds.filter(catId => {
        const catServices = servicesMap[catId] || [];
        return catServices.some(svc => selectedServices.includes(svc._id));
      });

      if (validCategoryIds.length === 0) {
        return setError("Please select at least one service for your categories.");
      }

      setSelectedCategoryIds(validCategoryIds);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      for (const svcId of selectedServices) {
        const details = serviceDetails[svcId];
        const service = Object.values(servicesMap).flat().find(s => s._id === svcId);
        
        if (!details || (details.experience || 0) <= 0) {
          return setError(`Please enter years of experience for ${service?.service_name}.`);
        }
        if (!details || (details.price || 0) <= 0) {
          return setError(`Please enter a valid price for ${service?.service_name}.`);
        }
        if (!details.selectedLocations || details.selectedLocations.length === 0) {
          return setError(`Please select at least one location for ${service?.service_name}.`);
        }
        if (!details.skills || details.skills.trim() === "") {
          return setError(`Please list your skills for ${service?.service_name}.`);
        }
        if (!details.documents || details.documents.length === 0) {
          return setError(`Please upload at least one experience certificate for ${service?.service_name}.`);
        }
        if (!details.availability || details.availability.length === 0) {
          return setError(`Please set an availability schedule for ${service?.service_name}.`);
        }
      }
      setCurrentStep(3);
    }
    setError("");
  };

  const handleSubmit = async () => {
    // Step 3 Validation: Identity and Bank Details
    if (!idProof.file) return setError("Please upload your ID Proof (Government ID).");
    if (!selfie.file) return setError("Please capture or upload a selfie for verification.");
    
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(aadharId.replace(/\s/g, ""))) {
      return setError("Please enter a valid 12-digit Aadhar Number.");
    }

    if (!bankDetails.account_holder_name.trim()) return setError("Account Holder Name is required.");
    if (!bankDetails.account_number.trim() || bankDetails.account_number.length < 9) {
      return setError("Please enter a valid Bank Account Number.");
    }
    
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(bankDetails.ifsc_code.toUpperCase())) {
      return setError("Please enter a valid 11-digit IFSC Code (e.g., ABCD0123456).");
    }

    if (!bankDetails.bank_name.trim()) return setError("Bank Name is required.");
    if (!bankDetails.branch.trim()) return setError("Bank Branch is required.");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // 1. Get Provider ID
      const pRes = await fetch(`${API_URL}/providers/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const pData = await pRes.json();
      if (!pRes.ok) throw new Error(pData.message || "Failed to find provider profile");
      const providerId = pData._id;

      // 2. Update Identity Details via /me endpoint
      const updateMeRes = await fetch(`${API_URL}/providers/me`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          aadhar_id: aadharId,
          bank_details: bankDetails,
          verification_docs: { 
            id_proof_url: idProof.file_url || "", 
            selfie_url: selfie.file_url || "" 
          }
        }),
      });
      if (!updateMeRes.ok) {
        const errorData = await updateMeRes.json();
        throw new Error(errorData.message || "Failed to update identity and bank details.");
      }

      for (const serviceId of selectedServices) {
        const service = Object.values(servicesMap).flat().find(s => s._id === serviceId);
        const details = serviceDetails[serviceId] || {};

        const psRes = await fetch(`${API_URL}/provider-services`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            provider_id: providerId,
            service_id: serviceId,
            service_name: service?.service_name,
            experience: details.experience || 0,
            price: details.price || 0,
            skills: (details.skills || "").split(',').map((s: string) => s.trim()).filter((s: string) => s !== ""),
            location_ids: details.selectedLocations || [],
            availability: details.availability || [],
            documents: (details.documents || []).map((d: any) => ({
              doc_type: d.doc_type,
              file_url: d.file_url || ""
            }))
          }),
        });

        if (!psRes.ok) {
          const errorData = await psRes.json();
          throw new Error(errorData.message || `Failed to register ${service?.service_name}.`);
        }
      }

      router.push("/provider/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const iconClass = "w-4 h-4";
    switch (iconName.toLowerCase()) {
      case 'home': return <Home className={iconClass} />;
      case 'brush': return <Brush className={iconClass} />;
      case 'hammer': return <Hammer className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'trees': return <Trees className={iconClass} />;
      case 'monitor': return <Monitor className={iconClass} />;
      case 'user': return <UserIcon className={iconClass} />;
      case 'package': return <Package className={iconClass} />;
      case 'graduation': return <GraduationCap className={iconClass} />;
      default: return <Package className={iconClass} />;
    }
  };

  const nextPage = () => { if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1); };
  const prevPage = () => { if (currentPage > 0) setCurrentPage(prev => prev - 1); };
  const visibleCategories = categories.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4 py-8">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 border-t-8 border-[#1D2B83]"
      >
        {/* Stepper */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i < (currentStep === 0 ? 3 : currentStep === 1 ? 4 : currentStep === 2 ? 5 : 5) ? "w-6 bg-[#1D2B83]" : "w-4 bg-slate-100"}`}></div>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold text-[#1D2B83] tracking-tight mb-1.5">
            {currentStep === 3 ? "Verify your identity" : currentStep === 0 ? "Choose categories" : currentStep === 1 ? "Refine services" : "Professional details"}
          </h1>
          <p className="text-slate-400 font-medium text-[13px] max-w-[320px] mx-auto leading-relaxed">
            {currentStep === 3
              ? "To maintain our service standards of trust and safety, please provide the following details."
              : currentStep === 0 ? "Select your expertise areas." : currentStep === 1 ? "Pick specific services." : "Provide experience, location & schedule."}
          </p>
        </div>

        {/* Steps Content */}
        <div className="max-h-[340px] overflow-y-auto pr-2 custom-scrollbar space-y-6 mb-6">
          {currentStep === 0 && (
            <div className="relative group px-10">
              <div className="grid grid-cols-3 gap-2.5">
                {visibleCategories.map((cat) => (
                  <button key={cat._id} onClick={() => handleCategoryToggle(cat._id)} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all group min-h-[100px] ${selectedCategoryIds.includes(cat._id) ? "border-[#1D2B83] bg-[#F0F2FF] shadow-sm" : "border-slate-50 bg-[#F5F7FA]"}`}>
                    <div className={`mb-2 p-2.5 rounded-full ${selectedCategoryIds.includes(cat._id) ? "bg-[#1D2B83] text-white" : "bg-white text-[#1D2B83]"}`}>{getIcon(cat.icon)}</div>
                    <span className={`text-[10px] font-bold text-center leading-tight ${selectedCategoryIds.includes(cat._id) ? "text-[#1D2B83]" : "text-slate-600"}`}>{cat.category_name}</span>
                  </button>
                ))}
              </div>
              {totalPages > 1 && (
                <>
                  <button onClick={prevPage} disabled={currentPage === 0} className="absolute left-0 top-1/2 -translate-y-1/2 p-2"><ChevronLeft className="w-5 h-5 text-[#1D2B83]" /></button>
                  <button onClick={nextPage} disabled={currentPage === totalPages - 1} className="absolute right-0 top-1/2 -translate-y-1/2 p-2"><ChevronRight className="w-5 h-5 text-[#1D2B83]" /></button>
                </>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              {selectedCategoryIds.map(catId => {
                const category = categories.find(c => c._id === catId);
                const services = servicesMap[catId] || [];
                return (
                  <div key={catId} className="space-y-2.5">
                    <div className="flex items-center justify-between pl-1 pr-2">
                      <h4 className="text-[11px] font-bold text-slate-500">{category?.category_name}</h4>
                      <button onClick={() => handleCategoryToggle(catId)} className="p-1 rounded-md bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Minus className="w-3 h-3" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {services.map(svc => (
                        <button key={svc._id} onClick={() => toggleService(svc._id)} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border-2 ${selectedServices.includes(svc._id) ? "border-[#1D2B83] bg-[#F0F2FF]" : "border-slate-50 bg-[#F5F7FA]"}`}>
                          <span className="text-[12px] font-bold">{svc.service_name}</span>
                          {selectedServices.includes(svc._id) ? <Check className="w-3.5 h-3.5 text-[#1D2B83]" /> : <Plus className="w-3.5 h-3.5 text-slate-300" />}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              {selectedServices.map(serviceId => {
                const service = Object.values(servicesMap).flat().find(s => s._id === serviceId);
                const details = serviceDetails[serviceId] || { 
                  experience: 0, 
                  price: 0, 
                  skills: "", 
                  selectedLocations: [], 
                  availability: [],
                  documents: []
                };
                return (
                  <div key={serviceId} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-6">
                    <div className="flex items-center gap-2 text-[#1D2B83]">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm"><Award className="w-4 h-4" /></div>
                      <h4 className="text-sm font-bold">{service?.service_name}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Experience</label>
                        <input 
                          type="number" 
                          value={details.experience === 0 ? "" : details.experience} 
                          onFocus={(e) => e.target.select()} 
                          onChange={(e) => {
                            const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                            handleServiceDetailChange(serviceId, 'experience', isNaN(val) ? 0 : val);
                          }} 
                          className="w-full px-4 py-2 border rounded-xl text-sm" 
                          placeholder="0" 
                        />
                      </div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Price</label>
                        <input 
                          type="number" 
                          value={details.price === 0 ? "" : details.price} 
                          onFocus={(e) => e.target.select()} 
                          onChange={(e) => {
                            const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                            handleServiceDetailChange(serviceId, 'price', isNaN(val) ? 0 : val);
                          }} 
                          className="w-full px-4 py-2 border rounded-xl text-sm" 
                          placeholder="0" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Service Locations</label>
                      <div className="flex flex-wrap gap-2">
                        {locations.map(loc => (
                          <button key={loc._id} onClick={() => {
                            const isSelected = details.selectedLocations.includes(loc._id);
                            handleServiceDetailChange(serviceId, 'selectedLocations', isSelected ? details.selectedLocations.filter(id => id !== loc._id) : [...details.selectedLocations, loc._id]);
                          }} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${details.selectedLocations.includes(loc._id) ? "bg-[#1D2B83] text-white border-[#1D2B83]" : "bg-white text-slate-500 border-slate-200"}`}>
                            {loc.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Brush className="w-3 h-3" /> Skills (Comma separated)</label>
                      <input 
                        type="text" 
                        value={details.skills} 
                        onChange={(e) => handleServiceDetailChange(serviceId, 'skills', e.target.value)} 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1D2B83]/20" 
                        placeholder="e.g. Plumbing, Leak Repair, Pipe Fitting" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><FileText className="w-3 h-3" /> Experience Certificates</label>
                      <div className="flex flex-wrap gap-2 mb-1">
                        {(details.documents || []).map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                            <FileText className="w-3.5 h-3.5 text-[#1D2B83]" />
                            <span className="text-[10px] font-medium text-[#1D2B83] truncate max-w-[100px]">{doc.file?.name}</span>
                            <button onClick={() => {
                              const nextDocs = (details.documents || []).filter((_, i) => i !== idx);
                              handleServiceDetailChange(serviceId, 'documents', nextDocs);
                            }}><Minus className="w-3 h-3 text-red-500" /></button>
                          </div>
                        ))}
                      </div>
                      <label className="flex items-center justify-center p-3.5 bg-white border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#1D2B83] transition-all group">
                        <Upload className="w-4 h-4 text-slate-400 group-hover:text-[#1D2B83] mr-2" />
                        <span className="text-[11px] font-bold text-slate-500">Upload Certificate</span>
                        <input type="file" className="hidden" multiple onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const newDocs = files.map(file => ({ doc_type: 'Experience Certificate', file, file_url: URL.createObjectURL(file) }));
                          handleServiceDetailChange(serviceId, 'documents', [...(details.documents || []), ...newDocs]);
                        }} />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Availability</label>
                      {(details.availability || []).map((av, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100">
                          <select value={av.day} onChange={(e) => {
                            const nextAv = [...(details.availability || [])];
                            nextAv[idx].day = e.target.value;
                            handleServiceDetailChange(serviceId, 'availability', nextAv);
                          }} className="text-[11px] font-bold text-slate-600 outline-none flex-1 bg-transparent">
                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <input type="time" value={av.start_time} onChange={(e) => {
                            const nextAv = [...(details.availability || [])];
                            nextAv[idx].start_time = e.target.value;
                            handleServiceDetailChange(serviceId, 'availability', nextAv);
                          }} className="text-[11px] font-bold text-slate-600 outline-none" />
                          <span className="text-slate-300">-</span>
                          <input type="time" value={av.end_time} onChange={(e) => {
                            const nextAv = [...(details.availability || [])];
                            nextAv[idx].end_time = e.target.value;
                            handleServiceDetailChange(serviceId, 'availability', nextAv);
                          }} className="text-[11px] font-bold text-slate-600 outline-none" />
                          <button onClick={() => {
                            const nextAv = (details.availability || []).filter((_, i) => i !== idx);
                            handleServiceDetailChange(serviceId, 'availability', nextAv);
                          }} className="p-1 text-slate-300 hover:text-red-500"><Minus className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <button onClick={() => handleServiceDetailChange(serviceId, 'availability', [...(details.availability || []), { day: "Monday", start_time: "09:00", end_time: "18:00" }])} className="text-[10px] font-bold text-[#1D2B83] hover:underline pl-1">+ Add Slot</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ID Proof Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pl-1">
                  <Contact2 className="w-4 h-4 text-[#1D2B83]" />
                  <h3 className="text-[13px] font-bold text-slate-700">ID Proof</h3>
                </div>
                <label className="relative flex flex-col items-center justify-center p-6 bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-[1.5rem] cursor-pointer hover:border-[#1D2B83] hover:bg-[#F0F2FF] transition-all group">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-[#94A3B8] group-hover:text-[#1D2B83]" />
                  </div>
                  <span className="text-[13px] font-bold text-[#334155]">Drag & drop Government ID</span>
                  <span className="text-[10px] text-[#94A3B8] mt-1">PDF, JPG, or PNG (Max 10MB)</span>
                  {idProof.file && (
                    <div className="mt-3 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-1.5">
                      <Check className="w-3 h-3" /> {idProof.file.name}
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setIdProof({ doc_type: 'ID Proof', file, file_url: URL.createObjectURL(file) });
                  }} />
                </label>
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aadhar ID Number</label>
                  <input
                    type="text"
                    value={aadharId}
                    onChange={(e) => setAadharId(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F1F5F9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1D2B83] outline-none transition-all"
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
              </div>

              {/* Selfie Verification Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pl-1">
                  <UserCircle className="w-4 h-4 text-[#1D2B83]" />
                  <h3 className="text-[13px] font-bold text-slate-700">Selfie Verification</h3>
                </div>
                <div className="flex items-center gap-4 px-1">
                  <div className="w-14 h-14 bg-[#F1F5F9] rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden flex-shrink-0">
                    {selfie.file_url ? (
                      <img src={selfie.file_url} className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-[#CBD5E1]" />
                    )}
                  </div>
                  <label className="flex-1 cursor-pointer bg-[#F1F5F9] hover:bg-[#E2E8F0] py-3 rounded-xl text-center text-[12px] font-bold text-[#475569] transition-all flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" />
                    Capture or upload a selfie
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelfie({ doc_type: 'Selfie', file, file_url: URL.createObjectURL(file) });
                    }} />
                  </label>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="space-y-3 pt-5 border-t border-slate-100">
                <div className="flex items-center gap-2 pl-1">
                  <Landmark className="w-4 h-4 text-[#1D2B83]" />
                  <h3 className="text-[13px] font-bold text-slate-700">Bank Details</h3>
                </div>
                <div className="space-y-3 px-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Holder Name</label>
                    <input
                      type="text"
                      value={bankDetails.account_holder_name}
                      onChange={(e) => setBankDetails({ ...bankDetails, account_holder_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F1F5F9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1D2B83] outline-none transition-all"
                      placeholder="Full name as per bank records"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Number</label>
                      <input
                        type="text"
                        value={bankDetails.account_number}
                        onChange={(e) => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F1F5F9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1D2B83] outline-none transition-all"
                        placeholder="Digits only"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IFSC / Routing Code</label>
                      <input
                        type="text"
                        value={bankDetails.ifsc_code}
                        onChange={(e) => setBankDetails({ ...bankDetails, ifsc_code: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F1F5F9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1D2B83] outline-none transition-all"
                        placeholder="ABCD0123456"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bank Name</label>
                      <input
                        type="text"
                        value={bankDetails.bank_name}
                        onChange={(e) => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F1F5F9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1D2B83] outline-none transition-all"
                        placeholder="e.g. HDFC Bank"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Branch</label>
                      <input
                        type="text"
                        value={bankDetails.branch}
                        onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F1F5F9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1D2B83] outline-none transition-all"
                        placeholder="e.g. Downtown"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500 font-bold text-center mb-6">{error}</p>}

        <div className="flex flex-col gap-3">
          <button
            onClick={currentStep < 3 ? handleNextStep : handleSubmit}
            disabled={loading}
            className="w-full bg-[#1D2B83] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all hover:bg-[#161F63]"
          >
            <span className="text-[15px]">{loading ? "Saving..." : "Continue"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.back()}
            className="text-slate-400 hover:text-[#1D2B83] font-bold text-[13px] py-1 text-center transition-colors"
          >
            {currentStep === 3 ? "Go Back" : "Previous Step"}
          </button>

          {currentStep === 3 && (
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 animate-pulse">
              <Info className="w-3.5 h-3.5" />
              <span>Your data is encrypted and stored securely</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
