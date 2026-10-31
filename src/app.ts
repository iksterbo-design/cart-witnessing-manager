import { AppState } from './types';
import { initialState, getStats, formatNumber } from './state';
import { Header, StatsCards, ShiftCalendar, MapView, InventoryCounter, ErrorState, EmptyState } from './components';

export function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [selectedShift, setSelectedShift] = useState<VolunteerShift | null>(null);
  const [draggingItem, setDraggingItem] = useState<LiteratureItem | null>(null);

  const stats = getStats(state);

  const handleToggleDark = () => {
    setState((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
    // Also update document class for CSS
    document.documentElement.classList.toggle('dark', !state.darkMode);
  };

  const handleShiftClick = (shift: VolunteerShift) => {
    setSelectedShift(shift);
  };

  const handleItemDrag = (item: LiteratureItem) => {
    setDraggingItem(item);
  };

  const handleItemDrop = (item: LiteratureItem) => {
    // In a real app, this would decrement inventory or trigger a cart action
    console.log(`Dropped: ${item.title} (count: ${item.count})`);
    setDraggingItem(null);
  };

  const handleItemDelete = (id: string) => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((i) => i.id !== id),
    }));
  };

  const activeCarts = state.carts.filter((c) => c.status === 'active');
  const todayShifts = state.shifts.filter((s) => {
    const today = new Date().toISOString().split('T')[0];
    return s.date === today;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <Header darkMode={state.darkMode} onToggleDark={handleToggleDark} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, Volunteer
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your cart locations, schedule shifts, and manage literature inventory.
          </p>
        </div>

        {/* Stats Grid */}
        <StatsCards stats={stats} />

        {/* Main grid: Calendar + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shift Calendar */}
          <div className="space-y-6">
            <ShiftCalendar shifts={state.shifts} onShiftClick={handleShiftClick} />
            {todayShifts.length > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Today's Shifts</h3>
                </div>
                <ul className="space-y-1.5">
                  {todayShifts.map((shift) => (
                    <li
                      key={shift.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-700 dark:text-slate-200">
                        {shift.volunteerName} <span className="font-medium">{shift.role}</span>
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {shift.startTime} – {shift.endTime}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Map */}
          <MapView carts={activeCarts.length > 0 ? activeCarts : state.carts} />
        </div>

        {/* Bottom grid: Inventory + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryCounter
            inventory={state.inventory}
            onItemDrag={handleItemDrag}
            onItemDrop={handleItemDrop}
            onItemDelete={handleItemDelete}
          />

          {/* Quick Cart Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <CartIcon className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Cart Status Overview
              </h3>
            </div>
            <div className="space-y-3">
              {state.carts.map((cart) => (
                <div
                  key={cart.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    cart.status === 'active'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                      : cart.status === 'maintenance'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                        : 'bg-slate-50 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`
                      w-2 h-2 rounded-full ${cart.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}
                    `} />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{cart.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {cart.location ? `Lat ${cart.location.lat.toFixed(4)}, Lng ${cart.location.lng.toFixed(4)}` : 'Location not set'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${getStatusColor(cart.status)}`}>
                    {cart.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h4>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors">
                  + Add Cart
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors">
                  + Schedule Shift
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors">
                  Restock Inventory
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-50 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected shift detail */}
        {selectedShift && (
          <div className="fixed bottom-6 right-6 max-w-sm bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-5 animate-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-white truncate">{selectedShift.volunteerName}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedShift.role}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {selectedShift.date} · {selectedShift.startTime} – {selectedShift.endTime}
                </p>
              </div>
              <button
                onClick={() => setSelectedShift(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Close shift details"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
            {selectedShift.notes && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedShift.notes}</p>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Witness Cart Manager · Public Witnessing Program Dashboard · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
