# IdeaPilot MVP Launch Status & Operations Guide

This document summarizes the current launch status, system architecture, operational configurations, and owner manual tasks for the **IdeaPilot (IP)** MVP deployment.

---

## 1. Launch Status Summary
* **Repository Branch**: `main` (Latest commit: `bd15899`)
* **Project Status**: decoupled and migrated to serverless runtime. Ready for closed beta trial.
* **Production Web App (Pages)**: [https://ideapilot-web.pages.dev](https://ideapilot-web.pages.dev)
* **Production API Service (Worker)**: [https://ideapilot-api.348421501.workers.dev](https://ideapilot-api.348421501.workers.dev)
* **Health Check Endpoint**: [https://ideapilot-api.348421501.workers.dev/healthz](https://ideapilot-api.348421501.workers.dev/healthz) → Returns `{"status":"healthy","env":"production"}`

---

## 2. Completed Modules
1. **Cloudflare + DeepSeek Backend**:
   - OpenAI-compatible chat completion utilizing **DeepSeek V4 Flash** (`deepseek-v4-flash`).
   - Dynamic prompt formatting based on `AnalyzeRequest` parameters.
   - Robust JSON validation and schema normalizer with local heuristics fallback generator.
   - Decoupled API endpoints: `/healthz` and POST `/api/analyze`.
2. **Business Value Audit Core**:
   - 7 core metrics evaluated: `commercialValue`, `painkillerIndex`, `monetizationClarity`, `targetBuyerFit`, `advantageAmplification`, `growthLeverage`, `executionFeasibility`.
   - Comprehensive sections: Money Paths, Target Buyers, Advantage Moat Map, Growth Levers, Risk Warnings.
   - Decoupled from all visual hotspot layouts and layout coordinates.
3. **AI Business Mentor Selection**:
   - Decoupled selector UI supporting three modes: `quick_scan` (solo Naval Ravikant), `single_mentor` (Steve Jobs / customized), and `mentor_board` (Elon Musk, Jeff Bezos, Mark Zuckerberg).
   - Structured disclaimer text stating evaluations are inspired by business philosophies rather than personal ratings.
4. **Pilot Credits System**:
   - `localStorage`-based credit ledger and transactions history.
   - Spend checks: 3 credits for Quick Scan, 5 for Single Mentor, 12 for Mentor Board.
   - Request-level pre-deduction with auto-refund triggers on connection/LLM failures.
   - Earn Credits growth loops: Daily Check-in, Share on X, Invite referral code, and Submit feedback.

---

## 3. Owner Manual Tasks (Critical Actions Required)
To keep token costs predictable and prevent security exploits before public GA, the project owner **MUST** manually execute the following steps:

### A. Rotate DeepSeek API Key (Urgent)
The current DeepSeek key has been flagged. Run this command directly in your terminal to set a new rotated key (never share it in public channels/conversation logs):
```bash
printf "%s" "YOUR_NEW_DEEPSEEK_API_KEY" | npx wrangler secret put DEEPSEEK_API_KEY --config wrangler.api.toml
```

### B. Configure Cloudflare Dashboard WAF / Rate Limiter
The in-memory rate limiter in the Worker code provides basic protection. Set up the following rules in your Cloudflare dashboard for the `/api/analyze` path:
* **IP Rate Limit**: Max 5 requests per minute, and Max 30 requests per hour.
* **Security Action**: Trigger a Cloudflare Managed Challenge (JS challenge/CAPTCHA) on threshold breaches.
* **Bot Fight Mode**: Enable Bot Fight Mode to block automated scripting crawlers.
* **User-Agent Filtering**: Block empty or generic request user-agents.

### C. Domain Configuration
To point to custom brand domains, map them in the Cloudflare Dashboard:
* `ideapilot.com` → Cloudflare Pages project (`ideapilot-web`)
* `api.ideapilot.com` → Cloudflare Worker route (`ideapilot-api`)

---

## 4. Closed Beta Trial Plan
* **Audience Size**: 20–50 selected independent developers and builders.
* **Trial Period**: 3–5 days.
* **Core Metrics to Track**:
  - Daily active visitors and total `/api/analyze` query volumes.
  - DeepSeek API token consumption cost curves.
  - Fallback report trigger rates.
  - Sharing conversion: Share on X button clicks and referral link copy counts.
  - User feedback on the value of the Business Score card.

---

## 5. Excluded Feature Backlog (Out of Scope for MVP)
The following features are **frozen** and will not be worked on during this release cycle:
* Database integration (Cloudflare D1 tables for persistent credits or leaderboard invite lists).
* Static report archiving (Cloudflare R2 bucket integration).
* Stripe/USDT payment gates and subscription tier monetization.
* Multi-model routing/failover policies.
* SEO case pages or directory submission indices.
* Expansion of the AI Mentor roster.
