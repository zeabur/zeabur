<p align="center">
  <a href="https://zeabur.com"><strong>Home</strong></a> ·
  <a href="https://zeabur.com/docs"><strong>Documentation</strong></a> ·
  <a href="https://zeabur.com/templates"><strong>Templates</strong></a> ·
  <a href="https://zeabur.com/forum"><strong>Forum</strong></a> ·
  <a href="https://discord.gg/DrdGCvXEyY"><strong>Discord</strong></a>
</p>

<br/>

## Intro

Zeabur is a platform that helps developers deploy their services with one click — no matter what programming language or framework is used.

<a href="https://www.producthunt.com/posts/zeabur?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-zeabur" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=404816&theme=light&period=daily" alt="Zeabur - Deploy&#0032;painlessly&#0032;and&#0032;scale&#0032;infinitely&#0032;with&#0032;just&#0032;one&#0032;click | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Features

### One-Click Deployment

Zeabur automatically analyzes your code to detect its language and framework — no Dockerfile or docker-compose.yml required.

Push to your repository and Zeabur builds, deploys, and updates your service automatically. It supports GitHub integration, Dockerfile, Docker images, CLI, a Chrome extension, and more.

### Servers & Clusters

Zeabur supports two infrastructure options:

- **[Servers](https://zeabur.com/docs/server)** — Single-machine deployments. Buy a server from Zeabur or bring your own hardware (AWS, GCP, Hetzner, your own datacenter). Zeabur manages deployments, firewall rules, and resource allocation — no SSH required. Billed monthly at a fixed rate; ideal for small-to-medium workloads and stable production services.

- **[Clusters](https://zeabur.com/docs/cluster)** — Multi-node Kubernetes environments for high-availability workloads. Get cross-node scheduling, automatic failover, distributed storage, and horizontal scaling. Purchase a cluster from Zeabur or connect your own existing Kubernetes cluster.

### Wonder Mesh (Beta)

[Wonder Mesh](https://zeabur.com/docs/wonder-mesh) turns any computer or server into a Zeabur compute node using an encrypted WireGuard tunnel — no public IP, no port forwarding, no firewall changes needed.

- Works from home labs, offices, or any network environment.
- Deploy templates, push code, bind domains, and monitor resources just like any managed server.
- Supports Linux (amd64/arm64) and macOS (amd64/arm64).

### AI Hub

[AI Hub](https://zeabur.com/docs/ai-hub) is a unified AI service platform giving you access to multiple AI models (OpenAI GPT, Anthropic Claude, xAI Grok, and more) through a single API key.

- Compatible with the OpenAI API format — drop it into existing applications with minimal changes.
- Transparent pay-as-you-go billing per token with full usage history.
- Multi-region endpoints (Tokyo, San Francisco) for optimal latency.

### Domain

Zeabur provides full [domain management](https://zeabur.com/docs/domain) capabilities:

- Register and manage domains directly from the Zeabur dashboard.
- Assign free `zeabur.app` subdomains or bring your own custom domain with one click.
- Manage DNS records and registrant profiles in the same place.

### Email

[Zeabur Email](https://zeabur.com/docs/email) is an enterprise-grade email sending API service built on AWS SES with a 99.9% uptime guarantee.

- Simple REST API for instant, scheduled, and batch sending.
- Webhook notifications for delivery, bounce, and complaint events.
- Custom sender domain support with DKIM/SPF verification.

### Templates

Zeabur offers a rich catalog of [one-click deployment templates](https://zeabur.com/templates) for popular services — WordPress, Postgres, Redis, n8n, Ghost, and hundreds more.

- Each template pre-wires services, environment variables, and connection settings automatically.
- Create and share your own templates via YAML.

### Integrations

Zeabur provides [built-in integrations](https://zeabur.com/docs/integrations) with third-party services so you can add powerful backend capabilities to your project without separate deployments.

- **InsForge** — An agent-native Supabase alternative with PostgreSQL, JWT auth, S3-compatible storage, serverless edge functions, and MCP protocol support for AI IDE integration.

### Powerful Configuration

- Environment variables managed from the dashboard — no `.env` files required.
- Multiple environment support (`production`, `staging`, `development`, etc.) with separate domains and branches.
- Rollback, suspend, restart, and scale services with one click.
- Invite team members to collaborate on the same project.

### Pay as You Go

Zeabur uses a consumption-based pricing model — you only pay for the resources your services actually use, billed by the minute.

See the [pricing page](https://zeabur.com/docs/pricing) for details.

### Developer Tools

- **[GraphQL API](https://api.zeabur.com/graphql)** — Full programmatic access to projects, services, deployments, and logs.
- **[Zeabur CLI](https://zeabur.com/docs/developer/cli)** — Deploy and manage services from your terminal with `npx zeabur`.
- **REST APIs** — Upload API for ZIP deployments, Email REST API, and more.
- **WebSocket subscriptions** — Stream real-time logs and project events.

## Community & Support

- **[Community Forum](https://zeabur.com/forum)** — Official support hub for questions, issues, and discussions. Priority response times for paid plans.
- **[Discord](https://discord.gg/DrdGCvXEyY)** — Chat with the Zeabur community.
- **[GitHub Discussions](https://github.com/orgs/zeabur/discussions)** — Feature requests and community discussions.

## Documentation

For full details, visit [zeabur.com/docs](https://zeabur.com/docs).

## Contributing

### Dashboard Localization

Help translate the Zeabur dashboard and earn credits through the [Contribution Reward Program](https://zeabur.com/docs/rewards/contribution). Contact us on [Discord](https://zeabur.com/dc) or the [forum](https://zeabur.com/forum) to get started.

### Templates

Publish a template to the [template marketplace](https://zeabur.com/templates) and earn rewards. See the [template format guide](https://zeabur.com/docs/template/template-format) to get started.
