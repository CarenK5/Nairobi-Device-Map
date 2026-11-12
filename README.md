# Nairobi device map

React + Vite app that maps where devices sit in their lifecycle (deployed, in repair, refurbished, recycled) across Nairobi sites, with dispatch route estimates from a refurbishment hub.

**AI feature:** an "Ask the map" box turns a plain-English question into map filters and highlights. It calls a serverless function (`api/ask.js`) that keeps the API key server-side, and falls back to a local parser when no key is set.

## Run
```
npm install
npm run dev
```

## Deploy (Vercel)
Import the repo (Vite preset). For the AI feature add the env var `OPENAI_API_KEY` (optionally `OPENAI_MODEL`, default `gpt-4o-mini`). Without it the app still works using the local parser.

## Notes
Sample data; the map is schematic. Next steps: real tiles (MapLibre + OpenStreetMap), a database for devices, TypeScript.
