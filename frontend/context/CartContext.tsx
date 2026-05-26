"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_URL } from "@/config/api";
import { GlobalTimeSlotModal } from "@/components/common/GlobalTimeSlotModal";
import { message } from "antd";

interface CartItem {
  subservice_id: {
    _id: string;
    subservice_name: string;
    base_price: number;
    image?: string;
  };
  quantity: number;
  price_snapshot: number;
}

interface CartContextType {
  cart: any | null;
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (subserviceId: string, quantity?: number) => Promise<void>;
  updateQuantity: (subserviceId: string, quantity: number) => Promise<void>;
  removeFromCart: (subserviceId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  selectedDate: "today" | "tomorrow";
  setSelectedDate: (date: "today" | "tomorrow") => void;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
  isTimeSlotModalOpen: boolean;
  setIsTimeSlotModalOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Time Slot Selection States
  const [selectedDate, setSelectedDate] = useState<"today" | "tomorrow">("today");

  // Always starts as null — no default time selected per UX requirement
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);

  // Sync selectedDate to localStorage (but NOT selectedSlot — no defaults)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedDate", selectedDate);
    }
  }, [selectedDate]);

  const fetchCart = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || token === "null" || token === "undefined") {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (subserviceId: string, quantity: number = 1) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || token === "null" || token === "undefined") return;

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subservice_id: subserviceId, quantity }),
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
        // Always reset slot so modal opens with no pre-selection
        setSelectedSlot(null);
        setIsTimeSlotModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const updateQuantity = async (subserviceId: string, quantity: number) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || token === "null" || token === "undefined") return;

    try {
      const response = await fetch(`${API_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subservice_id: subserviceId, quantity }),
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const removeFromCart = async (subserviceId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || token === "null" || token === "undefined") return;

    try {
      const response = await fetch(`${API_URL}/cart/item/${subserviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const clearCart = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || token === "null" || token === "undefined") return;

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setCart({ items: [], total_amount: 0 });
        // Reset selected slot and date to prevent old selections persisting to future bookings
        setSelectedSlot(null);
        setSelectedDate("today");
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const itemCount = cart?.items?.length || 0;
  const totalAmount = cart?.total_amount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalAmount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        selectedDate,
        setSelectedDate,
        selectedSlot,
        setSelectedSlot,
        isTimeSlotModalOpen,
        setIsTimeSlotModalOpen,
      }}
    >
      {children}
      <GlobalTimeSlotModal
        isOpen={isTimeSlotModalOpen}
        onClose={() => setIsTimeSlotModalOpen(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSlot={selectedSlot}
        setSelectedSlot={(slot) => setSelectedSlot(slot)}
        onConfirm={() => {
          setIsTimeSlotModalOpen(false);
          message.success(`Time slot confirmed: ${selectedDate === "today" ? "Today" : "Tomorrow"} at ${selectedSlot}`);
        }}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
