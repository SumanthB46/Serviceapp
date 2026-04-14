"use client";

import React, { useState } from "react";
import { 
  Button, 
  Input, 
  Checkbox, 
  Form, 
  Divider,
  App
} from "antd";
import { 
  GoogleOutlined, 
  FacebookFilled, 
  GithubFilled, 
  MailOutlined, 
  LockOutlined 
} from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import StickyNavPill from "@/components/common/StickyNavPill";
import { API_URL } from '@/config/api';

const LoginForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const onFinish = async (values: any) => {
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
                
                // Store user info and token
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));

                // Redirect based on role
                if (data.role === "admin") {
                    router.push("/admin");
                } else if (data.role === "provider") {
                    router.push("/provider/dashboard"); // Or wherever the provider dashboard is
                } else {
                    router.push("/"); // Customer to landing page
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

    return (
        <main className="min-h-screen bg-[#FCF8FF] flex flex-col">
            <StickyNavPill />
            <Navbar />
            
            <div className="flex-grow flex items-center justify-center px-6 py-24 relative overflow-hidden">
                {/* Background Decorative Blobs */}
                <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl opacity-60" />

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 p-8 md:p-12 border border-white">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                                Welcome Back
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Log in to manage your sanctuary.
                            </p>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <Button 
                                icon={<GoogleOutlined />} 
                                className="h-14 rounded-2xl flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm"
                            />
                            <Button 
                                icon={<FacebookFilled />} 
                                className="h-14 rounded-2xl flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                            />
                            <Button 
                                icon={<GithubFilled />} 
                                className="h-14 rounded-2xl flex items-center justify-center hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm"
                            />
                        </div>

                        <Divider className="text-slate-300 text-xs font-bold uppercase tracking-widest my-8">
                            Or with email
                        </Divider>

                        {/* Login Form */}
                        <Form
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
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

                            <Form.Item className="mb-0">
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading}
                                    className="w-full h-14 bg-[#1D2B83] rounded-2xl font-bold tracking-wide shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all"
                                >
                                    SIGN IN
                                </Button>
                            </Form.Item>
                        </Form>

                        {/* Sign Up Link */}
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
        </main>
    );
};

const LoginComponent = () => (
    <App>
        <LoginForm />
    </App>
);

export default LoginComponent;
