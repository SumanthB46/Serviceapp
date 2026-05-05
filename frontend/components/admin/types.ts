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
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  is_available?: boolean;
  skills: string[];
  documents: ProviderDocument[];
  availability: {
    day: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    buffer_time: number;
  }[];
  weekly_off?: string[];
  blocked_dates?: { date: string; reason: string }[];
  service_radius_km: number;
  service_rating: number;
  total_reviews: number;
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
  kyc_status: 'pending' | 'verified' | 'rejected';
  location_id?: {
    _id: string;
    name: string;
    state?: string;
    country?: string;
  };
  total_jobs: number;
  completed_jobs: number;
  cancelled_jobs: number;
  acceptance_rate: number;
  completion_rate: number;
  years_of_experience: number;
  bio?: string;
  languages?: string[];
  profile_image?: string;
  rejection_reason?: string;
  overall_rating: number;
  rating_breakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  portfolio?: { image: string; description: string }[];
  last_active_at?: string;
  is_verified: boolean;
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
  pincode?: string;
  coordinates?: {
    type: 'Point';
    coordinates: number[];
  };
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
  max_discount?: number;
  usage_limit?: number;
  per_user_limit?: number;
  applicable_on: 'all' | 'service' | 'provider';
  min_amount: number;
  expiry_date: string;
  status: 'active' | 'inactive';

  createdAt: string;
  updatedAt: string;
}
