"use client";

import React, { useState, useEffect } from "react";
import AddServiceModal from "@/components/provider/modals/AddServiceModal";
import EditServiceModal from "@/components/provider/modals/EditServiceModal";
import DeleteServiceModal from "@/components/provider/modals/DeleteServiceModal";
import axios from "axios";
import { API_URL } from "@/config/api";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Star, 
  Clock, 
  Zap,
  ToggleLeft as Toggle,
  ToggleRight,
  Sparkles,
  Loader2
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [providerId, setProviderId] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jwt");
      if (!token) return;

      // 1. Fetch Provider Profile
      const providerRes = await axios.get(`${API_URL}/providers/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pId = providerRes.data._id;
      setProviderId(pId);

      // 2. Fetch Provider Services
      if (pId) {
        const servicesRes = await axios.get(`${API_URL}/provider-services/${pId}`);
        setServices(servicesRes.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jwt");
      await axios.put(`${API_URL}/provider-services/${id}`, 
        { is_available: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(services.map(s => s._id === id ? { ...s, is_available: !currentStatus } : s));
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const handleDeleteService = (service: any) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteService = async () => {
    if (!selectedService) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jwt");
      await axios.delete(`${API_URL}/provider-services/${selectedService._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.filter(s => s._id !== selectedService._id));
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (service: any) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-8 w-full text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services Management</h1>
          <p className="text-slate-500 font-medium">Manage your service offerings, pricing, and availability.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl w-full">
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-100 w-full md:w-96">
          <Search className="h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search your services..." 
            className="bg-transparent border-none outline-none text-sm text-slate-600 w-full font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary w-full md:w-40">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-bold">Loading your services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {services.map((service) => {
            const firstSub = service.subservice_ids?.[0] || {};
            return (
              <div key={service._id} className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
                {/* Image & Badges */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={firstSub.image || "https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=800&auto=format&fit=crop&q=60"} 
                    alt={firstSub.subservice_name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {service.is_featured && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                    {/* <span className={`px-3 py-1.5 ${service.is_available ? "bg-emerald-500" : "bg-slate-500"} text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg`}>
                      {service.is_available ? "Active" : "Offline"}
                    </span> */}
                    </div>
                  </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">4.8</span>
                      {/* <span className="text-xs text-slate-400 font-medium">(New)</span> */}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2 min-h-[3.5rem]">
                    {firstSub.subservice_name || "Custom Service"}
                    {service.subservice_ids?.length > 1 && ` (+${service.subservice_ids.length - 1} more)`}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Starting Price
                      </span>
                      <span className="text-slate-900 font-bold">₹{service.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Experience
                      </span>
                      <span className="text-slate-900 font-bold">{service.experience} Years</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                    {/* <button 
                      onClick={() => toggleAvailability(service._id, service.is_available)}
                      className="flex items-center gap-2 text-sm font-bold text-slate-500"
                    >
                      {service.is_available ? (
                        <ToggleRight className="h-6 w-6 text-emerald-500" />
                      ) : (
                        <Toggle className="h-6 w-6 text-slate-300" />
                      )}
                      Available
                    </button> */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditClick(service)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Service Placeholder */}
          {/* <button 
            onClick={() => setIsAddModalOpen(true)}
            className="h-full min-h-[400px] rounded-[32px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-slate-50 transition-all group"
          >
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm border border-slate-100">
              <Plus className="h-8 w-8" />
            </div>
            <div className="text-center px-6">
              <span className="block text-lg font-bold text-slate-900">Add New Service</span>
              <span className="block text-sm font-medium text-slate-400 mt-1">Scale your business by adding more categories</span>
            </div>
          </button> */}
        </div>
      )}

      <AddServiceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      
      <EditServiceModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        service={selectedService}
        onSuccess={fetchInitialData}
      />

      <DeleteServiceModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          if (!isEditModalOpen) setSelectedService(null);
        }}
        onConfirm={confirmDeleteService}
        serviceName={selectedService?.subservice_ids?.[0]?.subservice_name || "this service"}
        loading={isDeleting}
      />
    </div>
  );
}
