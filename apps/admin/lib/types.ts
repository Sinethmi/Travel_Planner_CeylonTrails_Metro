export interface Destination {
  id: string;
  name: string;
  region: string;
  vibe: string[];
  description: string;
  lat: number;
  lng: number;
  image: string;
  rating: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  preferences: {
    darkMode: boolean;
    pushNotifications: boolean;
    favoriteVibes: string[];
  };
  createdAt: number;
}
