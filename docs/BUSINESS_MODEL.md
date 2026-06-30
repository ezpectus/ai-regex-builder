# Business Model

## Product Description

AI Regex Builder is a developer tool that converts natural language descriptions into regular expressions. Users describe what they want to match (e.g., "extract all email addresses"), and AI generates a valid regex pattern with explanation, flags, and real-time testing against sample text.

## Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | Bring your own OpenAI or Gemini API key. All features unlocked. localStorage history. |
| **Hosted** | $3/mo | Hosted version with shared API key. No setup required. Unlimited generations. |
| **Pro** | $10/mo | Priority AI model (GPT-4o), team sharing, cloud history sync, export to 20+ languages, API access. |
| **Enterprise** | $50/mo | Self-hosted deployment, custom AI models, SSO, audit logs, SLA, priority support. |

## Target Customers

- **Individual developers** — quick regex generation without memorizing syntax
- **QA engineers** — pattern matching for test data validation
- **Data analysts** — text extraction and cleaning
- **DevOps teams** — log parsing and pattern matching
- **Students** — learning regex with interactive explanations

## Marketing Channels

- **GitHub** — open-source repo with README badges and screenshots
- **Dev.to / Medium** — technical blog posts about regex patterns
- **Reddit** — r/programming, r/webdev, r/javascript
- **Hacker News** — Show HN post on launch
- **Twitter/X** — developer community engagement
- **Product Hunt** — launch day campaign
- **Stack Overflow** — answer regex questions with tool link
- **Discord/Slack communities** — developer group recommendations

## Revenue Projections

| Month | Free | Hosted | Pro | Enterprise | MRR |
|-------|------|--------|-----|------------|-----|
| M1 | 500 | 10 | 2 | 0 | $50 |
| M3 | 2,000 | 50 | 10 | 1 | $340 |
| M6 | 5,000 | 150 | 30 | 3 | $1,150 |
| M12 | 15,000 | 500 | 100 | 10 | $4,000 |

## Cost Structure

- **OpenAI API** — ~$0.15 per 1M tokens (gpt-4o-mini). Average user: 50 generations/mo ≈ $0.01/user/mo
- **Hosting** — Vercel free tier for MVP, $20/mo Pro for production
- **Domain** — $12/year
- **Total monthly cost at 500 hosted users**: ~$25 (hosting + API)

## Competitive Advantage

- **AI-powered** — no need to know regex syntax
- **Real-time testing** — instant feedback with highlighting
- **Multi-language export** — 7 languages out of the box
- **Local-first** — API key stored in browser, no backend dependency
- **Open-source friendly** — self-host with Ollama for zero API cost

## Disclaimer

This document contains forward-looking projections that are estimates only. Actual results may vary. No financial advice is provided herein.
