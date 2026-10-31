// Types for the Public Witnessing Cart Manager

export interface WitnessCart {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: LatLng;
  inventory: LiteratureItem[];
  lastUpdated: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface LiteratureItem {
  id: string;
  title: string;
  count: number;
  icon: string;
  description: string;
}

export interface VolunteerShift {
  id: string;
  volunteerName: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  status: 'scheduled' | 'checked-in' | 'completed' | 'cancelled';
  notes?: string;
}

export interface AppState {
  carts: WitnessCart[];
  shifts: VolunteerShift[];
  inventory: LiteratureItem[];
  darkMode: boolean;
}
