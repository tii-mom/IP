# IdeaPilot

An AI-powered startup and landing page commercialization diagnostic platform. Decoupled and fully deployed on Cloudflare Pages (Frontend SPA) and Cloudflare Worker API (Backend) utilizing the DeepSeek V4 Flash engine.

## Development and Deployment Setup

### Environment Variables

Create `.dev.vars` in the project root for local Worker API development:
```env
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
TURNSTILE_SECRET_KEY=your-cloudflare-turnstile-secret
ALLOWED_ORIGINS=http://localhost:5173
APP_ENV=development
SITE_URL=http://localhost:5173
API_BASE_URL=http://localhost:8787
```

### Dev Execution

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the frontend Vite server:
   ```bash
   npm run dev
   ```

3. Run the Worker API emulator:
   ```bash
   npm run dev:api
   ```

### Deploying to Cloudflare

- **Deploy Backend API**:
  ```bash
  npm run deploy:api
  ```

- **Deploy Frontend Web**:
  ```bash
  npm run build
  npm run deploy:web
  ```
