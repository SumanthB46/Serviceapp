export interface Booking {
  id: string;
  customer: string;
  provider: string;
  service: string;
  date: string;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

export interface ProviderDocument {
  doc_type: string;
  file_url: string;
  uploaded_at: string;
}

export interface ProviderService {
  _id: string;
  provider_id: string | { _id: string; user_id: { name: string; email: string } };
  service_id: string;
  service_name: string;
  experience: number;
  price: number;
  skills: string[];
  documents: ProviderDocument[];
  service_rating: number;
  is_active: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface Provider {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profile_image?: string;
    status: string;
  };
  availability_status: 'available' | 'busy' | 'offline';
  location: string;
  overall_rating: number;
  is_verified: boolean;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
  services?: ProviderService[]; 
  isDeleted: boolean;
  createdAt: string;
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
export interface ILocation {
  _id: string;
  name: string;
  type: 'city' | 'area';
  parent_id?: string | ILocation | null;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdAt: string;
}

export interface IOffer {
  _id: string;
  code: string;
  coupon_id?: string;
  provider_service_id?: string;
  discount_type: 'flat' | 'percentage';
  discount_value: number;
  min_amount: number;
  expiry_date: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
