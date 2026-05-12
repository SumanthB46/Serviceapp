"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Home, 
  CheckCircle2, 
  ChevronLeft,
  Loader2
} from "lucide-react";
import { API_URL } from "@/config/api";
import { Button, Input, Form, message, Switch, Popconfirm } from "antd";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddressModal({ isOpen, onClose }: AddressModalProps) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAddresses = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
      setView("list");
      setEditingAddress(null);
    }
  }, [isOpen, fetchAddresses]);

  const handleAddNew = () => {
    setEditingAddress(null);
    setView("form");
  };


  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setView("form");
  };


  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        messageApi.success("Address deleted successfully");
        fetchAddresses();
      } else {
        messageApi.error("Failed to delete address");
      }
    } catch (error) {
      messageApi.error("An error occurred while deleting");
    }
  };

  const handleSave = async (values: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const url = editingAddress 
        ? `${API_URL}/addresses/${editingAddress._id}`
        : `${API_URL}/addresses`;
      
      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        messageApi.success(`Address ${editingAddress ? 'updated' : 'added'} successfully`);
        fetchAddresses();
        setView("list");
      } else {
        const data = await response.json();
        messageApi.error(data.message || "Failed to save address");
      }
    } catch (error) {
      messageApi.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (address: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      await fetch(`${API_URL}/addresses/${address._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...address, is_default: true })
      });
      fetchAddresses();
    } catch (e) {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {contextHolder}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#F8F9FC] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 z-10">
              <div className="flex items-center gap-4">
                {view === "form" && (
                  <button 
                    onClick={() => setView("list")}
                    className="p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    {view === "list" ? "Saved Addresses" : editingAddress ? "Edit Address" : "Add New Address"}
                  </h2>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                    Manage your service locations
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative">
              <AnimatePresence mode="wait">
                {view === "list" ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <button 
                      onClick={handleAddNew}
                      className="w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] border-2 border-dashed border-blue-200 bg-blue-50/50 text-[#1D2B83] font-bold hover:bg-blue-50 hover:border-blue-300 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Plus className="w-4 h-4" />
                      </div>
                      Add New Address
                    </button>

                    {loading ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-[#1D2B83] animate-spin" />
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-10 opacity-60">
                        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-500">No saved addresses found</p>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-6">
                        {addresses.map((address) => (
                          <div 
                            key={address._id}
                            onClick={() => !address.is_default && handleSetDefault(address)}
                            className={`p-6 bg-white rounded-[2rem] border-2 transition-all relative group cursor-pointer ${
                              address.is_default 
                                ? "border-[#1D2B83] shadow-lg shadow-blue-900/5 ring-1 ring-[#1D2B83]/10" 
                                : "border-transparent shadow-sm hover:border-slate-200 hover:shadow-md"
                            }`}
                          >
                            {address.is_default && (
                              <div className="absolute -top-3 left-6 px-3 py-1 bg-[#1D2B83] text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-sm z-10">
                                <CheckCircle2 className="w-3 h-3" /> Default
                              </div>
                            )}

                            <div className="flex justify-between items-start gap-4">
                              <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${address.is_default ? "bg-blue-50 text-[#1D2B83]" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#1D2B83]"}`}>
                                  <Home className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800 mb-1 leading-relaxed max-w-sm">
                                    {address.address_line}
                                    {address.landmark && <span className="block text-slate-500 font-medium">Landmark: {address.landmark}</span>}
                                  </p>
                                  <p className="text-xs font-bold text-slate-400">
                                    {address.city}, {address.state} - {address.pincode}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                {!address.is_default && (
                                  <button 
                                    onClick={() => handleSetDefault(address)}
                                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#1D2B83] px-3 py-2 bg-slate-50 hover:bg-blue-50 rounded-lg transition-all"
                                  >
                                    Set Default
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleEdit(address)}
                                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <Popconfirm
                                  title="Delete this address?"
                                  onConfirm={() => handleDelete(address._id)}
                                  okText="Delete"
                                  cancelText="Cancel"
                                  okButtonProps={{ danger: true }}
                                >
                                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-all">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </Popconfirm>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSave}
                      requiredMark={false}
                      initialValues={editingAddress || { is_default: false }}
                      className="space-y-4"
                    >
                      <Form.Item
                        label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Address Line / Building / Flat</span>}
                        name="address_line"
                        rules={[{ required: true, message: 'Please enter your address' }]}
                      >
                        <Input.TextArea 
                          rows={2}
                          placeholder="E.g., Flat 201, Sunshine Apartments, Main Street"
                          className="rounded-2xl font-bold border-slate-200 focus:border-[#1D2B83] resize-none pt-3"
                        />
                      </Form.Item>

                      <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                          label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</span>}
                          name="city"
                          rules={[{ required: true, message: 'Enter city' }]}
                        >
                          <Input 
                            placeholder="City"
                            className="h-12 rounded-2xl font-bold border-slate-200 focus:border-[#1D2B83]"
                          />
                        </Form.Item>

                        <Form.Item
                          label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">State</span>}
                          name="state"
                          rules={[{ required: true, message: 'Enter state' }]}
                        >
                          <Input 
                            placeholder="State"
                            className="h-12 rounded-2xl font-bold border-slate-200 focus:border-[#1D2B83]"
                          />
                        </Form.Item>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                          label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pincode</span>}
                          name="pincode"
                          rules={[{ required: true, message: 'Enter pincode' }]}
                        >
                          <Input 
                            placeholder="123456"
                            className="h-12 rounded-2xl font-bold border-slate-200 focus:border-[#1D2B83]"
                          />
                        </Form.Item>

                        <Form.Item
                          label={<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Landmark (Optional)</span>}
                          name="landmark"
                        >
                          <Input 
                            placeholder="Near park"
                            className="h-12 rounded-2xl font-bold border-slate-200 focus:border-[#1D2B83]"
                          />
                        </Form.Item>
                      </div>

                      <Form.Item
                        name="is_default"
                        valuePropName="checked"
                        className="mb-6 pt-2 border-t border-slate-100"
                      >
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-sm font-bold text-slate-800">Set as default address</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">We'll use this for your next bookings</p>
                          </div>
                          <Switch />
                        </div>
                      </Form.Item>

                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full h-14 bg-[#1D2B83] hover:bg-blue-800 border-none rounded-[1.25rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20"
                      >
                        {loading ? "Saving..." : "Save Address"}
                      </Button>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
