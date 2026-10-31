import { AppState, WitnessCart, LiteratureItem, VolunteerShift } from './types';

// Default icons for literature items
const defaultIcons: Record<string, string> = {
  bibles: '📖',
  tracts: '📜',
  flyers: '🖨️',
  booklets: '📃',
  gospels: '📯',
  children: '👶',
};

// Initial state with sample data for the dashboard
export const initialState: AppState = {
  carts: [
    {
      id: 'cart-1',
      name: 'Sunrise Outreach Cart',
      status: 'active',
      location: { lat: 40.7128, lng: -74.0060 },
      inventory: [
        { id: 'lit-1', title: 'Weekly Gospel Flyer', count: 120, icon: '🖨️', description: 'Weekly flyer for community outreach' },
        { id: 'lit-2', title: 'Bible Studies', count: 45, icon: '📖', description: 'Study materials for interested visitors' },
        { id: 'lit-3', title: 'Gospel Booklets', count: 200, icon: '📯', description: 'Keepsake booklets with testimony' },
      ],
      lastUpdated: '2026-01-15T08:30:00Z',
    },
    {
      id: 'cart-2',
      name: 'Riverside Mission Cart',
      status: 'active',
      location: { lat: 40.7282, lng: -73.7949 },
      inventory: [
        { id: 'lit-4', title: 'Community Resource Guide', count: 85, icon: '📃', description: 'Local resources and hotline numbers' },
        { id: 'lit-5', title: 'Bible Studies', count: 30, icon: '📖', description: 'Extended studies for follow-up' },
        { id: 'lit-6', title: 'Bible Psalms', count: 150, icon: '📯', description: 'Children\'s Psalms booklets' },
      ],
      lastUpdated: '2026-01-15T09:15:00Z',
    },
    {
      id: 'cart-3',
      name: 'Harbor Light Cart',
      status: 'maintenance',
      location: { lat: 40.7061, lng: -74.0134 },
      inventory: [
        { id: 'lit-7', title: 'Morning Glory Flyers', count: 0, icon: '🖨️', description: 'Promotional flyers (restocking)' },
      ],
      lastUpdated: '2026-01-15T07:45:00Z',
    },
  ],
  shifts: [
    {
      id: 'shift-1',
      volunteerName: 'Sarah Miller',
      date: '2026-01-15',
      startTime: '09:00',
      endTime: '13:00',
      role: 'Lead Cart Attendant',
      status: 'scheduled',
      notes: 'Primary outreach shift at Sunrise Cart',
    },
    {
      id: 'shift-2',
      volunteerName: 'James Chen',
      date: '2026-01-15',
      startTime: '10:00',
      endTime: '14:00',
      role: 'Assistant Attendant',
      status: 'scheduled',
      notes: 'Riverfront shift at Sunrise Cart',
    },
    {
      id: 'shift-3',
      volunteerName: 'Emily Rodriguez',
      date: '2026-01-16',
      startTime: '14:00',
      endTime: '18:00',
      role: 'Lead Cart Attendant',
      status: 'scheduled',
      notes: 'Evening shift at Riverside Cart',
    },
    {
      id: 'shift-4',
      volunteerName: 'David Kim',
      date: '2026-01-17',
      startTime: '11:00',
      endTime: '15:00',
      role: 'Stock & Inventory',
      status: 'checked-in',
      notes: 'Restocked literature at Harbor Light',
    },
    {
      id: 'shift-5',
      volunteerName: 'Aisha Patel',
      date: '2026-01-18',
      startTime: '09:00',
      endTime: '13:00',
      role: 'Lead Cart Attendant',
      status: 'scheduled',
      notes: 'Weekend outreach at Riverside Cart',
    },
  ],
  inventory: [
    { id: 'inv-1', title: 'Gospel Booklets', count: 655, icon: '📯', description: 'Core booklet for distribution' },
    { id: 'inv-2', title: 'Bible Studies', count: 185, icon: '📖', description: 'In-depth study materials' },
    { id: 'inv-3', title: 'Flyers', count: 460, icon: '🖨️', description: 'Weekly community flyers' },
    { id: 'inv-4', title: 'Booklets', count: 0, icon: '📃', description: 'Short-form literature (restocking)' },
    { id: 'inv-5', title: 'Psalms & Hymns', count: 320, icon: '📯', description: 'Children\'s collection' },
    { id: 'inv-6', title: 'Resource Guides', count: 120, icon: '📃', description: 'Community resource listings' },
    { id: 'inv-7', title: 'Daily Bread tracts', count: 95, icon: '📜', description: 'Short tracts for door-to-door' },
  ],
  darkMode: false,
};

// Compute derived stats from state
export function getStats(state: AppState) {
  const activeCarts = state.carts.filter((c) => c.status === 'active').length;
  const totalInventory = state.inventory.reduce((sum, item) => sum + item.count, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayShifts = state.shifts.filter((s) => s.date === today && s.status === 'scheduled').length;
  const volunteersToday = new Set(
    state.shifts.filter((s) => s.date === today).map((s) => s.volunteerName)
  ).size;
  const totalCarts = state.carts.length;
  const mappedLocations = state.carts.filter((c) => c.location).length;

  return {
    activeCarts,
    totalCarts,
    totalInventory,
    volunteersToday,
    todayShifts,
    mappedLocations,
    avgInventoryPerCart: totalCarts > 0 ? Math.round(totalInventory / totalCarts) : 0,
  };
}

// Format currency or numbers with thousands separators
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

// Get cart status color
export function getStatusColor(status: WitnessCart['status']): string {
  switch (status) {
    case 'active':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'inactive':
      return 'text-slate-500 dark:text-slate-400';
    case 'maintenance':
      return 'text-amber-600 dark:text-amber-400';
    default:
      return 'text-slate-500';
  }
}

// Get category icon or fallback
export function getIcon(item: LiteratureItem | undefined, category: string): string {
  if (item?.icon) return item.icon;
  return defaultIcons[category] || '📦';
}
