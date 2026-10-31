import {
  CartIcon, CalendarIcon, MapPinIcon, SunIcon, MoonIcon, UsersIcon,
  BookOpenIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, MinusIcon,
  CheckCircleIcon, XCircleIcon, DragIndicatorIcon, AlertIcon, ArrowRightIcon,
  RefreshIcon,
} from './icons';
import { initialState, getStats, formatNumber, getStatusColor, getIcon } from './state';
import { AppState, WitnessCart, VolunteerShift, LiteratureItem } from './types';

// ---- Header ----
export function Header({ darkMode, onToggleDark }: { darkMode: boolean; onToggleDark: () => void }) {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md">
              <CartIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                Witness Cart Manager
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Public Witnessing Cart Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">New Shift</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ---- Stats Cards ----
export function StatsCards({ stats }: { stats: typeof getStats(initialState) }) {
  const statCards = [
    {
      label: 'Active Carts',
      value: stats.activeCarts,
      icon: <CartIcon className="w-5 h-5" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
      accent: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Volunteers Today',
      value: stats.volunteersToday,
      icon: <UsersIcon className="w-5 h-5" />,
      color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
      accent: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Literature in Stock',
      value: formatNumber(stats.totalInventory),
      icon: <BookOpenIcon className="w-5 h-5" />,
      color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
      accent: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Locations Mapped',
      value: formatNumber(stats.mappedLocations),
      icon: <MapPinIcon className="w-5 h-5" />,
      color: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
      accent: 'from-rose-500 to-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((card, i) => (
        <div
          key={card.label}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm animate-in animate-in-delay-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${card.color}`}>
              {card.icon}
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatNumber(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---- Shift Calendar ----
interface CalendarProps {
  shifts: VolunteerShift[];
  onShiftClick: (shift: VolunteerShift) => void;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();

  // Add leading days from previous month
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month, 0 - i);
    days.push(new Date(date));
  }

  // Add days of current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  // Add trailing days from next month to fill 6 weeks
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push(new Date(year, month + 1, d));
  }

  return days;
}

export function ShiftCalendar({ shifts, onShiftClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = { year: new Date().getFullYear(), month: new Date().getMonth() };
  const [selectedDate, setSelectedDate] = new Date().toISOString().split('T')[0];

  const year = currentDate.year;
  const month = currentDate.month;
  const days = getDaysInMonth(year, month);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateObj = new Date(selectedDate + 'T00:00:00');

  const isSelected = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === selectedDateObj.getTime();
  };

  const isShiftDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const shiftDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return shifts.some((s) => {
      const shiftDate = new Date(s.date + 'T00:00:00');
      return shiftDate.getTime() === d.getTime();
    });
  };

  const shiftOnDay = (date: Date): VolunteerShift[] => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const shiftDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return shifts.filter((s) => s.date === shiftDate);
  };

  const goToPrevMonth = () => {
    if (month === 0) {
      setCurrentDate({ year: year - 1, month: 11 });
    } else {
      setCurrentDate({ year, month: month - 1 });
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setCurrentDate({ year: year + 1, month: 0 });
    } else {
      setCurrentDate({ year, month: month + 1 });
    }
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedDate(now.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Volunteer Shift Calendar
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              aria-label="Go to today"
            >
              <RefreshIcon className="w-4 h-4" />
            </button>
            <button
              onClick={goToPrevMonth}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              aria-label="Next month"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
          {monthNames[month]} {year}
        </p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-1.5 sm:py-2 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-1">
            {days.map((day, idx) => {
              const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
              const shiftedShifts = shiftOnDay(day);
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const isSelectedDay = isSelected(day);
              const hasShift = shiftedShifts.length > 0;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`
                    relative p-1.5 sm:p-2 rounded-lg border text-left transition-all
                    ${isSelectedDay
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500 dark:border-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }
                    ${hasShift ? 'relative' : ''}
                  `}
                >
                  <div className="flex items-center justify-center">
                    <span
                      className={`
                        text-xs sm:text-sm font-medium
                        ${isToday ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}
                        ${isSelectedDay ? 'text-indigo-700 dark:text-indigo-300' : ''}
                      `}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                  {hasShift && !isSelectedDay && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                  {shiftedShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="absolute bottom-3 left-2 right-2 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs p-1.5 shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
                      onClick={(e) => { e.stopPropagation(); onShiftClick(shift); }}
                    >
                      <div className="font-semibold text-xs">{shift.volunteerName}</div>
                      <div className="text-xs opacity-80">{shift.role}</div>
                    </div>
                  ))}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Shift Scheduled
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Checked In
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Today
          </span>
        </div>
      </div>
    </div>
  );
}

// ---- Map Placeholder ----
interface MapViewProps {
  carts: WitnessCart[];
}

export function MapView({ carts }: MapViewProps) {
  const [hoveredCart, setHoveredCart] = { id: null as string | null };
  const [selectedCart, setSelectedCart] = { id: null as string | null };

  const activeCarts = carts.filter((c) => c.status === 'active');
  const otherCarts = carts.filter((c) => c.status !== 'active');

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Cart Locations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeCarts.length} active · {otherCarts.length} maintenance/inactive
            </p>
          </div>
          <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
            <ArrowRightIcon className="w-3.5 h-3.5" />
            View Full Map
          </button>
        </div>
      </div>
      <div className="relative bg-slate-100 dark:bg-slate-900/50 aspect-video rounded-b-xl overflow-hidden">
        {/* Map grid pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        {/* Map markers */}
        {activeCarts.map((cart) => (
          <button
            key={cart.id}
            onClick={() => setSelectedCart(cart.id)}
            onMouseEnter={() => setHoveredCart(cart.id)}
            onMouseLeave={() => setHoveredCart(null)}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2 group
              transition-all duration-200 cursor-pointer
              ${
                selectedCart === cart.id
                  ? 'z-20 scale-110'
                  : hoveredCart === cart.id
                    ? 'z-10 scale-110'
                    : 'z-10 opacity-80 hover:opacity-100'
              }
            `}
            style={{ left: `${Math.abs(cart.location.lng) * 8 + 20}%`, top: `${cart.location.lat * 6 + 30}%` }}
          >
            <div className={`
              relative w-4 h-4 rounded-full border-2 shadow-md
              ${selectedCart === cart.id || hoveredCart === cart.id
                ? 'bg-indigo-600 border-white dark:border-slate-800'
                : 'bg-white border-indigo-500'
              }
            `}>
              <div className={`absolute inset-0 rounded-full bg-green-500 ${selectedCart === cart.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
            </div>
            <div className={`
              absolute left-1/2 -translate-x-1/2 -top-2.5 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap
              ${selectedCart === cart.id || hoveredCart === cart.id
                ? 'bg-white/90 text-slate-900 dark:bg-slate-800 dark:text-white'
                : 'bg-white/80 text-slate-700 dark:bg-slate-800 dark:text-white'
              }
            `}>
              {cart.name.split(' ').slice(0, 2).join(' ')}
            </div>
            {/* Status badge */}
            <div className={`
              absolute -bottom-1.5 right-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold
              ${cart.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}
            `}>
              {cart.status}
            </div>
          </button>
        ))}
        {activeCarts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <CartIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active cart locations</p>
            </div>
          </div>
        )}
        {/* Map controls (decorative) */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <button className="w-7 h-7 rounded bg-white/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors" aria-label="Zoom in">
            <PlusIcon className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded bg-white/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors" aria-label="Zoom out">
            <MinusIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {/* Legend */}
      <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white border-2 border-indigo-500" />
            <span>Active cart</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>In use</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Inventory Counter (Drag & Drop) ----
interface InventoryCounterProps {
  inventory: LiteratureItem[];
  onItemDrag: (item: LiteratureItem) => void;
  onItemDrop: (item: LiteratureItem) => void;
  onItemDelete?: (id: string) => void;
}

export function InventoryCounter({
  inventory,
  onItemDrag,
  onItemDrop,
  onItemDelete,
}: InventoryCounterProps) {
  const [draggedItem, setDraggedItem] = { id: null as string | null };
  const [draggingOver, setDraggingOver] = { id: null as string | null };

  const handleDragStart = (e: React.DragEvent, item: LiteratureItem) => {
    setDraggedItem(item.id);
    onItemDrag(item);
    e.dataTransfer.effect = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDraggingOver(id);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setDraggingOver(null);
  };

  const handleDrop = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    setDraggingOver(null);
    // Find the item being dropped
    const item = inventory.find((i) => i.id === draggedItem);
    if (item) {
      onItemDrop(item);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-indigo-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Literature Inventory
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {inventory.reduce((sum, i) => sum + i.count, 0).toLocaleString()} total items
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {inventory.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, item.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.id)}
            className={`
              group rounded-lg border p-3 cursor-grab active:cursor-grabbing
              transition-all duration-200
              ${draggedItem === item.id
                ? 'opacity-50 scale-[0.98] border-indigo-500'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }
              ${draggingOver === item.id ? 'shadow-md bg-indigo-50 dark:bg-indigo-900/20' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {item.icon}
                </span>
                <div>
                  <p className="font-medium text-sm text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrement}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  aria-label={`Decrease ${item.title} count`}
                >
                  <MinusIcon className="w-3.5 h-3.5" />
                </button>
                <span className="text-lg font-bold text-slate-900 dark:text-white min-w-[2.5rem] text-center">
                  {item.count.toLocaleString()}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  aria-label={`Increase ${item.title} count`}
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                </button>
                {onItemDelete && (
                  <button
                    onClick={() => onItemDelete(item.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Delete ${item.title}`}
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (item.count / 100) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 w-8 text-right">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Error / Empty States ----
export function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800 p-8 text-center">
      <AlertIcon className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, message }: { icon: React.ComponentType<{ className?: string }>; message: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
      <Icon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
