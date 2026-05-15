export type Vibe =
  | 'Adventure'
  | 'Nature'
  | 'History'
  | 'Beach'
  | 'Cultural'
  | 'Wildlife'
  | 'Relaxation'
  | 'Food';

export interface PlannerInput {
  destination: string;
  startDate: string;
  endDate: string;
  budget: 'Budget' | 'Mid-range' | 'Luxury';
  travelers: number;
  vibes: Vibe[];
  notes?: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  lat?: number;
  lng?: number;
  durationMins?: number;
  cost?: string;
  tip?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
}

export interface Itinerary {
  title: string;
  summary: string;
  totalBudget: string;
  days: ItineraryDay[];
}

export interface Trip {
  id: string;
  userId: string;
  input: PlannerInput;
  itinerary: Itinerary;
  photos?: string[];
  coverImage?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  preferences: {
    darkMode: boolean;
    pushNotifications: boolean;
    favoriteVibes: Vibe[];
  };
  createdAt: number;
}
