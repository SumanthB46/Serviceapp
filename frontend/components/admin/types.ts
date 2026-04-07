export interface Booking {
  id: string;
  customer: string;
  provider: string;
  service: string;
  date: string;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

export interface Provider {
  id: number;
  providerId: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  experience: number;
  rating: number;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Blocked';
  joinedDate: string;
  avatar?: string;
  idVerified: boolean;
  expVerified: boolean;
  docsRequested: boolean;
  active: boolean;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Blocked' | 'Pending';
  bookings?: number;
  spent?: string;
  joinedDate: string;
  lastActive?: string;
  role?: 'Customer' | 'Admin' | 'Support';
  avatar?: string;
}
