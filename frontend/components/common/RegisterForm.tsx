"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { API_URL } from '@/config/api';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer";

  const [useEmail, setUseEmail] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const validateIdentifier = () => {
    if (useEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        return "Please enter a valid email address.";
      }
    } else {
      if (!identifier || !isValidPhoneNumber(identifier)) {
        return "Please enter a valid phone number for the selected country.";
      }
    }
    return "";
  };

  const handleSendOtp = async () => {
    if (!identifier) return;
    const errorMsg = validateIdentifier();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, role, useEmail }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      
      // The OTP is logged to backend console, but in dev we can also peek at response data
      console.log('OTP sent successfully. Development mode code:', data.otpCode);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleEditIdentifier = () => {
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp: otpValue, useEmail }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      // Save user session
      localStorage.setItem("token", data.user.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect depending on user role
      if (data.user.role === "provider") {
        router.push("/provider_register");
      } else {
        router.push("/customer_register");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-xl p-8 relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-8 left-8 text-[#1D2B83] hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="text-center mt-12 mb-10">
          <h1 className="text-[32px] font-extrabold text-[#1D2B83] tracking-tight leading-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-slate-500 font-medium text-[15px]">
            Please enter your credentials to continue.
            {role && <span className="block mt-1 text-xs text-[#1D2B83] font-bold uppercase tracking-widest hidden">Registering as: {role}</span>}
          </p>
        </div>

        {/* Form Container */}
        <div className="space-y-6">
          <input type="hidden" name="role" value={role} />

          {/* Phone / Email Input Group */}
          <div>
            <label className="block text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">
              {useEmail ? "EMAIL ADDRESS" : "PHONE NUMBER"}
            </label>
            <div className="relative">
              {!useEmail ? (
                <div className={`w-full border-b-2 pb-2 transition-colors ${otpSent ? "opacity-60 cursor-not-allowed" : ""} ${error ? "border-red-400 focus-within:border-red-500" : "border-slate-100 focus-within:border-[#1D2B83]"}`}>
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    value={identifier}
                    onChange={(val) => {
                      setIdentifier(val ? val.toString() : "");
                      if (error) setError("");
                    }}
                    disabled={otpSent}
                    limitMaxLength={true}
                    className="w-full bg-transparent"
                  />
                  <style>{`
                    .PhoneInputInput {
                      border: none !important;
                      outline: none !important;
                      background: transparent;
                      font-size: 15px;
                      font-weight: 500;
                      color: #0f172a;
                    }
                    .PhoneInputInput::placeholder {
                      color: #cbd5e1;
                    }
                    .PhoneInputCountry {
                      margin-right: 12px;
                    }
                  `}</style>
                </div>
              ) : (
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={otpSent}
                  className={`w-full border-b-2 pb-2 text-[15px] font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none transition-colors bg-transparent ${otpSent ? "opacity-60 cursor-not-allowed" : ""} ${error ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-[#1D2B83]"}`}
                  placeholder="you@example.com"
                />
              )}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 font-medium mt-2 absolute"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Toggle Email/Phone */}
          {!otpSent && (
            <div>
              <button
                onClick={() => {
                  setUseEmail(!useEmail);
                  setIdentifier("");
                  setError("");
                }}
                className="text-[#1D2B83] text-sm font-bold hover:underline mt-2"
              >
                Use {useEmail ? "phone number" : "email"} instead
              </button>
            </div>
          )}

          {/* Send OTP Button */}
          <button
            onClick={handleSendOtp}
            disabled={otpSent || !identifier || loading}
            className={`w-full py-4 rounded-2xl font-bold tracking-wide transition-all shadow-md mt-2 ${otpSent || !identifier || loading
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-[#1D2B83] text-white hover:bg-[#16226b] hover:shadow-lg hover:shadow-blue-900/20 active:scale-[0.98]"
              }`}
          >
            {loading && !otpSent ? "Sending..." : "Send OTP"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-slate-400 text-sm font-medium">Or</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          {/* Google Button */}
          <button
            disabled={otpSent}
            className={`w-full py-4 rounded-2xl font-bold text-slate-700 bg-[#F3F4F8] hover:bg-[#E5E7EB] transition-colors flex items-center justify-center gap-3 ${otpSent ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* OTP Section (Visible only after sending OTP) */}
          <AnimatePresence>
            {otpSent && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 48 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="pt-8 text-center overflow-hidden"
              >
                <p className="text-sm font-medium mb-6 text-slate-500">
                  Verify the 6-digit code sent to your device
                </p>

                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl text-center text-xl font-bold bg-[#F8F9FC] transition-all focus:outline-none border border-slate-200 focus:border-[#1D2B83] focus:bg-white text-slate-800"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-6 mb-8 text-sm font-bold opacity-100">
                  <button className="text-[#8B93D6] hover:text-[#1D2B83]">
                    Resend OTP
                  </button>
                  <button onClick={handleEditIdentifier} className="text-[#8B93D6] hover:text-[#1D2B83]">
                    Edit phone/email
                  </button>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.some(d => !d) || loading}
                  className={`w-full py-4 rounded-2xl font-bold tracking-wide transition-all shadow-md mt-4 ${otp.some(d => !d) || loading
                    ? "bg-[#F3F4F8] text-white cursor-not-allowed shadow-none"
                    : "bg-[#1D2B83] text-white hover:bg-[#16226b] hover:shadow-lg hover:shadow-blue-900/20 active:scale-[0.98]"
                    }`}
                >
                  {loading && otpSent ? "Verifying..." : "Verify & Continue"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
