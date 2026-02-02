# Ticket Frontend 🎟️

**Ticket Frontend** is a Next.js + TypeScript frontend for managing events, categories and orders. It provides a lightweight UI and API client used to interact with a backend ticketing API.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (18+ recommended)
- npm, pnpm, or yarn

### Install
```bash
npm install
```

### Environment
Create a `.env.local` file at the project root and set the API base URL used by the app:

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com
```

> The frontend app constructs API requests using `NEXT_PUBLIC_API_URL + '/api'` (see `src/lib/api.ts`).

### Run (development)
```bash
npm run dev
# then open http://localhost:3000
```

### Build & Start (production)
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

---

## ✨ Features
- Browse and manage Events, Categories, and Orders
- Simple UI components (`Card`, `Form`, `Modal`, `Alert`, `Header`, `Button`)
- Reusable API client and typed service layer (`src/lib/api.ts`, `src/lib/services.ts`)
- Tailwind CSS for styling

---

## 🧭 Project Structure (high level)

- `src/app/` - Next.js app routes and pages (categories, events, orders, dashboard)
- `src/components/` - Reusable UI components
- `src/lib/` - API client and service helpers
- `public/` - Static assets

---

## 🔧 Development Notes & Tips
- API helper: `apiClient` (in `src/lib/api.ts`) handles requests and JSON parsing.
- Services: `categoryApi`, `eventApi`, and `orderApi` are typed helpers for endpoints (see `src/lib/services.ts`).
- Ensure `NEXT_PUBLIC_API_URL` points to a running backend that exposes the routes used by the services.

---

## 🧪 Tests
No tests are included by default. Consider adding unit tests with Jest/React Testing Library and E2E tests with Playwright.

---

## 🤝 Contributing
- Fork the repo, create a feature branch, and open a pull request with a clear description.
- Keep changes small and focused. Add tests where applicable.

---

## 📄 License
This project does not include a license file. Add one (e.g., `MIT`) if you intend to make it public.

---

Happy hacking! ⚡

