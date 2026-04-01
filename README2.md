# 🌑 Moondark

> Cloud-based modding for mobile & console. No limits.

Moondark streams modded gameplay from remote PC infrastructure to your device. No hardware bottlenecks, no compatibility issues, no limits.

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Mobile App │────▶│  ElysiaJS    │────▶│  Go Pion    │
│ (React      │◀────│  API (3001)  │◀────│  WebRTC     │
│  Native)    │     └──────────────┘     │  (3002)     │
└─────────────┘                          └─────────────┘
                                              │
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Dashboard   │────▶│  PostgreSQL  │     │  GPU Instance│
│ (SvelteKit) │     │   Redis      │     │  (Game+Mods) │
└─────────────┘     └──────────────┘     └─────────────┘
```

---

## Project Structure

```
moondark/
├── apps/
│   ├── api/           # ElysiaJS backend (Bun)
│   ├── mobile/        # React Native app (Expo)
│   ├── dashboard/     # SvelteKit admin dashboard
│   └── website/       # Landing page
├── packages/
│   ├── types/         # Shared TypeScript types
│   ├── utils/         # Shared utilities
│   └── signaling/     # Go Pion WebRTC sidecar
├── docker-compose.yml # Local dev infrastructure
└── package.json       # Root workspace config
```

---

## Getting Started

### Prerequisites

- **Bun** 1.3+
- **Go** 1.26+
- **Docker** + Docker Compose

### Install

```bash
bun install
```

### Start Infrastructure

```bash
docker compose up -d postgres redis
```

### Start Dev Servers

```bash
# API (port 3001)
bun run dev:api

# Dashboard (port 5173)
bun run dev:dashboard

# Go signaling service (port 3002)
bun run dev:signaling

# All JS services
bun run dev
```

---

## API Endpoints

| Method   | Path            | Description              |
| -------- | --------------- | ------------------------ |
| `GET`    | `/health`       | Health check             |
| `GET`    | `/mods`         | List available mods      |
| `GET`    | `/mods/:id`     | Mod details              |
| `POST`   | `/sessions`     | Create streaming session |
| `GET`    | `/sessions`     | List all sessions        |
| `GET`    | `/sessions/:id` | Session status           |
| `DELETE` | `/sessions/:id` | Terminate session        |
| `POST`   | `/webrtc/offer` | WebRTC signaling         |
| `POST`   | `/webrtc/ice`   | ICE candidate exchange   |
| `POST`   | `/input`        | Forward input to session |

---

## Tech Stack

| Component        | Technology          |
| ---------------- | ------------------- |
| Backend API      | ElysiaJS (Bun)      |
| WebRTC Signaling | Go + Pion           |
| Mobile App       | React Native (Expo) |
| Dashboard        | SvelteKit           |
| Database         | PostgreSQL          |
| Cache            | Redis               |
| Monorepo         | Vite+ workspaces    |

## License

[The Fight Club License](https://github.com/benlk/misc-licenses/blob/master/fight-club-license.md)
