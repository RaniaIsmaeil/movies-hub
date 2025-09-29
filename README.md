# Movies Hub (Full Project)

A complete React + Vite + Tailwind movies app with:
- Responsive navbar with debounced search + dropdown
- Sections: Trending, Popular, Top Rated (paginated)
- Movie details page (routing with react-router-dom)
- TMDB API layer with **mock fallback** if you don't provide a key
- Overflow-safe dropdowns and mobile-friendly layout

## 1) Setup
```bash
npm install
echo 'VITE_TMDB_API_KEY=TMDB_BEARER_TOKEN' > .env
npm run dev
```
If no token is set, the app still runs with mock data in order to demo UI.

## 2) Project Structure
- `src/api/tmdb.js` — tiny fetch wrapper + endpoints (+ mock fallback)
- `src/hooks/usePaged.js` — reusable hook for page-based fetching
- `src/components/*` — Navbar, MovieGrid, MovieCard, Section
- `src/pages/Home.jsx` — three sections with pagination
- `src/pages/MovieDetails.jsx` — details view
- `tailwind.config.js` — Tailwind scan paths
- `vite.config.js` — Vite config

## 3) Notes
- The search dropdown is right-anchored and width-capped to avoid horizontal scrollbars.
- Debounce is set to 350ms for a responsive search experience.
- Replace mock data by adding a TMDB token from **Account → Settings → API → API Read Access Token (v4)**.
