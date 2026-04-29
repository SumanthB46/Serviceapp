"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu, Bell, X, Pencil, Save,
  User2, Mail, Phone, ShieldCheck, Lock, CheckCircle2, AlertCircle, Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from '@/config/api';

interface HeaderProps { onMenuClick: () => void; }

interface UserProfile {
  _id: string; name: string; email: string;
  phone: string; role: string; profile_image?: string; status: string;
}

interface FormState { name: string; email: string; phone: string; password: string; }
interface ErrorState { name: string; email: string; phone: string; password: string; }

/* ─── Validation helpers ─── */
const validators = {
  name: (v: string) => {
    if (!v.trim()) return "Name is required";
    if (!/^[A-Za-z\s]+$/.test(v)) return "Only letters and spaces allowed";
    if (v.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  },
  email: (v: string) => {
    if (!v.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
    return "";
  },
  phone: (v: string) => {
    if (!v.trim()) return "Phone is required";
    if (!/^\d{10}$/.test(v)) return "Phone must be exactly 10 digits";
    return "";
  },
  password: (v: string) => {
    if (!v) return "";
    if (v.length < 6) return "Minimum 6 characters";
    if (!/[A-Z]/.test(v)) return "Must include at least 1 uppercase letter";
    if (!/[a-z]/.test(v)) return "Must include at least 1 lowercase letter";
    if (!/[0-9]/.test(v)) return "Must include at least 1 digit";
    if (!/[^A-Za-z0-9]/.test(v)) return "Must include at least 1 symbol";
    return "";
  },
};

/* ─── Compress image to base64 via canvas ─── */
const compressImage = (file: File, maxWidth = 200, quality = 0.8): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas not supported");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ─── Avatar fallback (initials) ─── */
const AvatarFallback = ({ name }: { name: string }) => {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-sm">
      {initials}
    </div>
  );
};

/* ─── Inline error tag ─── */
const FieldError = ({ msg }: { msg: string }) =>
  msg ? (
    <motion.p
      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-center gap-1 text-[10px] text-red-500 font-semibold mt-0.5"
    >
      <AlertCircle size={10} /> {msg}
    </motion.p>
  ) : null;

/* ══════════════════════════════════════════ */
const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  // profile image preview (local, before save)
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<ErrorState>({ name: "", email: "", phone: "", password: "" });
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false, email: false, phone: false, password: false,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  /* load user from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed: UserProfile = JSON.parse(stored);
        setUser(parsed);
        setForm({ name: parsed.name, email: parsed.email, phone: parsed.phone, password: "" });
      } catch { }
    }
  }, []);

  /* close on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) closeModal();
    };
    if (modalOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [modalOpen]);

  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setSaveSuccess(false);
    resetForm();
  };

  const resetForm = () => {
    if (user) setForm({ name: user.name, email: user.email, phone: user.phone, password: "" });
    setErrors({ name: "", email: "", phone: "", password: "" });
    setTouched({ name: false, email: false, phone: false, password: false });
    setPreviewImg(null);
    setImgError(false);
  };

  /* ─── Image pick handler ─── */
  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    try {
      const base64 = await compressImage(file, 300, 0.85);
      setPreviewImg(base64);
      setImgError(false);
    } catch {
      console.error("Image compression failed");
    }
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  /* ─── Validation ─── */
  const validateField = (field: keyof FormState, value: string) => validators[field](value);

  const handleChange = (field: keyof FormState, raw: string) => {
    let value = raw;
    if (field === "phone") value = raw.replace(/\D/g, "").slice(0, 10);
    if (field === "name") value = raw.replace(/[^A-Za-z\s]/g, "");
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, form[field]) }));
  };

  const validateAll = (): boolean => {
    const newErrors: ErrorState = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      phone: validateField("phone", form.phone),
      password: validateField("password", form.password),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, password: true });
    return Object.values(newErrors).every((e) => !e);
  };

  /* ─── Save ─── */
  const handleSave = async () => {
    if (!validateAll()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const body: Record<string, string> = {
        name: form.name, email: form.email, phone: form.phone,
      };
      if (form.password.trim()) body.password = form.password;
      if (previewImg) body.profile_image = previewImg;

      const res = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const updated: UserProfile = await res.json();
        // Keep the previewImg in the saved user if backend didn't echo it back fully
        const merged = { ...updated, profile_image: previewImg ?? updated.profile_image };
        setUser(merged);
        const stored = localStorage.getItem("user");
        const prev = stored ? JSON.parse(stored) : {};
        localStorage.setItem("user", JSON.stringify({ ...prev, ...merged }));
        setEditMode(false);
        setSaveSuccess(true);
        setPreviewImg(null);
        setErrors({ name: "", email: "", phone: "", password: "" });
        setTouched({ name: false, email: false, phone: false, password: false });
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const displayImage = previewImg ?? (imgError ? null : (user?.profile_image || null));

  const roleBadge: Record<string, string> = {
    admin: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    provider: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    customer: "bg-green-50 text-green-700 ring-1 ring-green-200",
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImagePick}
      />

      {/* ── Top Header Bar ── */}
      <header className="h-14 bg-white sticky top-0 z-40 flex items-center justify-between px-8 border-b border-gray-100/50">
        <div className="flex items-center gap-4">
          <button
            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all lg:hidden"
            onClick={onMenuClick}
          >
            <Menu size={18} />
          </button>
        </div>

        <div className="flex items-center gap-5">
          <button className="relative p-1.5 text-gray-400 hover:text-blue-600 transition-all">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full border-2 border-white" />
          </button>
          <div className="h-5 w-[1px] bg-gray-100 hidden sm:block" />

          {/* Profile trigger */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setModalOpen(true)}>
            {/* Avatar */}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 flex-shrink-0">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <AvatarFallback name={user?.name || "Admin"} />
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div className="text-left hidden sm:block">
              <h4 className="text-[12px] font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                {user?.name || "Loading..."}
              </h4>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                {user?.role || "—"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Profile Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 backdrop-blur-sm pt-14 pr-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white rounded-2xl shadow-2xl shadow-blue-200/40 w-[360px] overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {/* Gradient banner */}
              <div className="relative h-24 bg-gradient-to-br from-[#1D2B83] to-indigo-500">
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
                >
                  <X size={14} />
                </button>

                {/* Avatar with camera overlay */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-[3px] border-white shadow-lg flex-shrink-0">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <AvatarFallback name={user?.name || "Admin"} />
                    )}

                    {/* Camera overlay — only in edit mode */}
                    {editMode && (
                      <button
                        onClick={() => fileInput.current?.click()}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 hover:bg-black/60 transition-all group/cam"
                        title="Change photo"
                      >
                        <Camera size={16} className="text-white group-hover/cam:scale-110 transition-transform" />
                        <span className="text-white text-[8px] font-bold mt-0.5 leading-tight">CHANGE</span>
                      </button>
                    )}
                  </div>

                  {/* Small camera badge when editing */}
                  {editMode && (
                    <button
                      onClick={() => fileInput.current?.click()}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1D2B83] rounded-full flex items-center justify-center border-2 border-white shadow hover:bg-blue-700 transition-all"
                    >
                      <Camera size={9} className="text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name / role / status row */}
              <div className="pt-12 px-5 pb-4 border-b border-gray-100 flex flex-col items-center text-center gap-1">
                <h3 className="text-sm font-bold text-gray-900">{user?.name}</h3>
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${roleBadge[user?.role ?? "customer"] ?? roleBadge["customer"]}`}>
                  {user?.role}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] text-gray-400 font-semibold capitalize">{user?.status}</span>
                </div>
              </div>

              {/* Preview notice */}
              <AnimatePresence>
                {previewImg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="mx-5 mt-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2"
                  >
                    <Camera size={12} className="text-blue-500 flex-shrink-0" />
                    <p className="text-[10px] text-blue-600 font-semibold">New photo selected — save to apply</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fields */}
              <div className="px-5 py-4 space-y-3 max-h-[50vh] overflow-y-auto">
                <ValidatedField
                  icon={<User2 size={13} className="text-blue-500" />}
                  label="Full Name" value={form.name}
                  error={touched.name ? errors.name : ""}
                  editing={editMode} placeholder="Enter full name"
                  onChange={(v) => handleChange("name", v)} onBlur={() => handleBlur("name")}
                />
                <ValidatedField
                  icon={<Mail size={13} className="text-blue-500" />}
                  label="Email" value={form.email}
                  error={touched.email ? errors.email : ""}
                  editing={editMode} type="email" placeholder="Enter email address"
                  onChange={(v) => handleChange("email", v)} onBlur={() => handleBlur("email")}
                />
                <ValidatedField
                  icon={<Phone size={13} className="text-blue-500" />}
                  label="Phone" value={form.phone}
                  error={touched.phone ? errors.phone : ""}
                  editing={editMode} type="tel" maxLength={10} placeholder="10-digit number"
                  onChange={(v) => handleChange("phone", v)} onBlur={() => handleBlur("phone")}
                />
                <ValidatedField
                  icon={<ShieldCheck size={13} className="text-blue-500" />}
                  label="Role" value={user?.role ?? ""} error=""
                  editing={false} onChange={() => { }} onBlur={() => { }}
                />

                {/* Password — edit mode only */}
                <AnimatePresence>
                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    >
                      <ValidatedField
                        icon={<Lock size={13} className="text-blue-500" />}
                        label="New Password" value={form.password}
                        error={touched.password ? errors.password : ""}
                        editing={true} type="password" placeholder="Leave blank to keep current"
                        onChange={(v) => handleChange("password", v)} onBlur={() => handleBlur("password")}
                      />
                      {!errors.password && (
                        <p className="text-[9px] text-gray-400 ml-10 -mt-1">
                          Min 6 chars · 1 uppercase · 1 lowercase · 1 digit · 1 symbol
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Save success */}
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-green-600 text-xs font-semibold bg-green-50 px-3 py-2 rounded-lg"
                    >
                      <CheckCircle2 size={14} /> Profile updated successfully!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              <div className="px-5 pb-5 flex gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={() => { setEditMode(false); resetForm(); }}
                      className="flex-1 h-9 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || hasErrors}
                      className="flex-1 h-9 rounded-xl bg-[#1D2B83] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-900/20"
                    >
                      <Save size={13} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex-1 h-9 rounded-xl bg-[#1D2B83] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-800 transition-all shadow-md shadow-blue-900/20"
                  >
                    <Pencil size={13} /> Edit Profile
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ══════════════════════════════════════════
   ValidatedField
══════════════════════════════════════════ */
interface ValidatedFieldProps {
  icon: React.ReactNode; label: string; value: string; error: string;
  editing: boolean; type?: string; maxLength?: number; placeholder?: string;
  onChange: (v: string) => void; onBlur: () => void;
}

const ValidatedField: React.FC<ValidatedFieldProps> = ({
  icon, label, value, error, editing, type = "text", maxLength, placeholder, onChange, onBlur,
}) => (
  <div className="flex gap-3">
    <div className="w-7 h-7 mt-4 flex-shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      {editing ? (
        <>
          <input
            type={type} value={value} maxLength={maxLength} placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
            className={`w-full text-xs font-medium text-gray-800 bg-gray-50 rounded-lg px-2 py-1.5 outline-none transition-all border ${error
              ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
              : "border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              }`}
          />
          <AnimatePresence>
            {error && <FieldError msg={error} />}
          </AnimatePresence>
        </>
      ) : (
        <p className="text-xs font-semibold text-gray-800 truncate mt-1">{value || "—"}</p>
      )}
    </div>
  </div>
);

export default Header;
