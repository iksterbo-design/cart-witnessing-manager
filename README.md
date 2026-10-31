# Cart Witnessing Manager

A digital dashboard for tracking public witnessing cart locations, scheduling volunteer shifts, and logging literature inventory.

## Live Demo

🔗 **Production URL:** https://cart-witnessing-manager.vercel.app

## Features

- **Dashboard Overview** — At-a-glance stats for active carts, volunteers, inventory, and mapped locations
- **Shift Calendar** — Month-view calendar with shift indicators, click to view volunteer details
- **Cart Locations** — Interactive map placeholder with hover/click markers showing cart status
- **Drag & Drop Inventory** — Drag literature items to quickly update counts; increment/decrement controls
- **Dark Mode** — Toggle between light and dark themes (respects system preference)

## Tech Stack

- **Framework:** [Vite](https://vite.dev/) + Vanilla TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI:** Responsive, mobile-first, WCAG-aware design system
- **Deployment:** [Vercel](https://vercel.com)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  main.ts           # App entry point
  app.ts            # Main application component
  types.ts          # TypeScript type definitions
  state.ts          # State management & initial data
  components.ts     # UI components (header, calendar, map, inventory)
  icons.ts          # Reusable SVG icons
  input.css         # Tailwind CSS + design system variables
```

## License

MIT
