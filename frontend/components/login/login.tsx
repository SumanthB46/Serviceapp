"use client";

import React, { useState } from "react";
import {
    Button,
    Input,
    Checkbox,
    Form,
    App,
    Tabs
} from "antd";
import {
    MailOutlined,
    LockOutlined,
    PhoneOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import StickyNavPill from "@/components/common/StickyNavPill";
import { API_URL } from '@/config/api';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const LoginForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("1"); // 1: Password, 2: OTP
    const { message } = App.useApp();

    // OTP State
    const [useEmail, setUseEmail] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const onFinishPassword = async (values: any) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                message.success("Login successful!");
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));

                if (data.role === "admin") {
                    router.push("/admin");
                } else if (data.role === "provider") {
                    router.push("/provider/dashboard");
                } else {
                    router.push("/");
                }
            } else {
                message.error(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            message.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!identifier) return;

        // Basic validation
        if (useEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(identifier)) {
                message.error("Please enter a valid email address.");
                return;
            }
        } else if (!isValidPhoneNumber(identifier)) {
            message.error("Please enter a valid phone number.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/users/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, useEmail, mode: 'login' }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to send OTP");

            message.success("OTP sent successfully!");
            setOtpSent(true);
        } catch (err: any) {
            message.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join("");
        if (otpValue.length < 6) return;

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/users/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, otp: otpValue, useEmail }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Invalid OTP");

            message.success("Login successful!");
            localStorage.setItem("token", data.user.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user._id === "pending_verification") {
                // New user - redirect to registration
                if (data.user.role === "provider") {
                    router.push("/provider_register");
                } else {
                    router.push("/customer_register");
                }
            } else {
                // Existing user
                if (data.user.role === "provider") {
                    router.push("/provider/dashboard");
                } else {
                    router.push("/");
                }
            }
        } catch (err: any) {
            message.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-login-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-login-${index - 1}`);
            prevInput?.focus();
        }
    };

    return (
        <main className="min-h-screen bg-[#FCF8FF] flex flex-col">
            <StickyNavPill />
            <Navbar />

            <div className="flex-grow flex items-center justify-center px-6 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl opacity-60" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 p-8 md:p-12 border border-white">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                                Welcome Back
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Log in to manage your sanctuary.
                            </p>
                        </div>

                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            centered
                            className="mb-8"
                            items={[
                                { key: "1", label: "Password" },
                                { key: "2", label: "OTP" },
                            ]}
                        />

                        {activeTab === "1" ? (
                            <Form
                                name="login-password"
                                onFinish={onFinishPassword}
                                layout="vertical"
                                requiredMark={false}
                            >
                                <Form.Item
                                    name="email"
                                    rules={[{ required: true, message: 'Please input your email!' }]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="text-slate-400 mr-2" />}
                                        placeholder="Email Address"
                                        className="h-14 rounded-2xl bg-slate-50 border-slate-100 hover:border-[#1D2B83] focus:border-[#1D2B83] transition-all text-sm font-medium"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                    className="mb-4"
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-slate-400 mr-2" />}
                                        placeholder="Password"
                                        className="h-14 rounded-2xl bg-slate-50 border-slate-100 hover:border-[#1D2B83] focus:border-[#1D2B83] transition-all text-sm font-medium"
                                    />
                                </Form.Item>

                                <div className="flex items-center justify-between mb-8">
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox className="text-xs font-bold text-slate-500">Remember me</Checkbox>
                                    </Form.Item>
                                    <Link href="/forgot-password" className="text-xs font-bold text-[#1D2B83] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    className="w-full h-14 bg-[#1D2B83] rounded-2xl font-bold tracking-wide shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all"
                                >
                                    SIGN IN
                                </Button>
                            </Form>
                        ) : (
                            <div className="space-y-6">
                                {!otpSent ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                                {useEmail ? "EMAIL ADDRESS" : "PHONE NUMBER"}
                                            </label>
                                            <div className="relative">
                                                {useEmail ? (
                                                    <Input
                                                        prefix={<MailOutlined className="text-slate-400 mr-2" />}
                                                        placeholder="you@example.com"
                                                        value={identifier}
                                                        onChange={(e) => setIdentifier(e.target.value)}
                                                        className="h-14 rounded-2xl bg-slate-50 border-slate-100 hover:border-[#1D2B83] focus:border-[#1D2B83] transition-all text-sm font-medium"
                                                    />
                                                ) : (
                                                    <div className="w-full h-14 px-4 flex items-center bg-slate-50 border border-slate-100 rounded-2xl focus-within:border-[#1D2B83] transition-all">
                                                        <PhoneInput
                                                            international
                                                            defaultCountry="IN"
                                                            value={identifier}
                                                            onChange={(val) => setIdentifier(val ? val.toString() : "")}
                                                            className="w-full bg-transparent outline-none text-sm font-medium"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="link"
                                                onClick={() => { setUseEmail(!useEmail); setIdentifier(""); }}
                                                className="p-0 text-xs font-bold text-[#1D2B83]"
                                            >
                                                Use {useEmail ? "phone number" : "email"} instead
                                            </Button>
                                        </div>

                                        <Button
                                            type="primary"
                                            onClick={handleSendOtp}
                                            loading={loading}
                                            disabled={!identifier}
                                            className="w-full h-14 bg-[#1D2B83] rounded-2xl font-bold tracking-wide shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all mt-4"
                                        >
                                            SEND OTP
                                        </Button>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-center"
                                    >
                                        <p className="text-sm font-medium mb-6 text-slate-500">
                                            Verify the 6-digit code sent to <br />
                                            <span className="text-slate-900 font-bold">{identifier}</span>
                                        </p>

                                        <div className="flex justify-center gap-2 mb-8">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    id={`otp-login-${i}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                    className="w-12 h-14 rounded-xl text-center text-2xl font-bold bg-white border-2 border-slate-200 text-[#1D2B83] focus:border-[#1D2B83] focus:bg-white outline-none transition-all shadow-sm hover:border-[#1D2B83]/50"
                                                />
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <Button
                                                type="primary"
                                                onClick={handleVerifyOtp}
                                                loading={loading}
                                                className="w-full h-14 bg-[#1D2B83] rounded-2xl font-bold tracking-wide shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all"
                                            >
                                                VERIFY & SIGN IN
                                            </Button>
                                            <Button
                                                type="link"
                                                onClick={() => setOtpSent(false)}
                                                icon={<ArrowLeftOutlined />}
                                                className="text-slate-500 font-bold"
                                            >
                                                Edit details
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}



                        <div className="mt-10 text-center">
                            <p className="text-sm font-medium text-slate-500">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-[#1D2B83] font-bold hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
            <style jsx global>{`
                .ant-tabs-nav::before {
                    border-bottom: none !important;
                }
                .ant-tabs-tab {
                    font-weight: 700 !important;
                    color: #94a3b8 !important;
                }
                .ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: #1D2B83 !important;
                }
                .ant-tabs-ink-bar {
                    background: #1D2B83 !important;
                    height: 3px !important;
                    border-radius: 3px !important;
                }
                .PhoneInputInput {
                    border: none !important;
                    outline: none !important;
                    background: transparent;
                    font-size: 14px;
                    font-weight: 500;
                    color: #0f172a;
                }
            `}</style>
        </main>
    );
};

const LoginComponent = () => (
    <App>
        <LoginForm />
    </App>
);

export default LoginComponent;
