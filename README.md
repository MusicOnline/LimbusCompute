# Limbus Compute

**Website: https://musiconline.github.io/LimbusCompute/**

[![Deploy SSG to GitHub Pages](https://github.com/MusicOnline/LimbusCompute/actions/workflows/deploy-ghpages.yml/badge.svg)](https://github.com/MusicOnline/LimbusCompute/actions/workflows/deploy-ghpages.yml)

Work-in-progress toolbox for Limbus Company, a turn-based RPG developed by Project Moon. Made with [Nuxt](https://nuxt.com).

## Development

### Setup

Prerequisites:

- Node.js (developed & tested with version 20.8.0)
- pnpm (or convert the lockfile/commands yourself)

Clone the repository, then install the dependencies:

```bash
git clone https://github.com/MusicOnline/LimbusCompute
pnpm install
```

### Configuration

Create a `.env` file with the following content or define the environment variables elsewhere:

```bash
# Set to true if "pnpm generate" should be prerendered to HTML
# Set to false to only render HTML using JS when browsed to (no SEO support)
# Alternatively, this can be set in nuxt.config.ts in ssr
ENABLE_SSR=true

# For generating static files for GitHub Pages deployment,
# repository pages are deployed to username.github.io/RespositoryNameHere
# Therefore this must be set to correct the routing base URL
# Alternatively, this can be set in nuxt.config.ts in app.baseURL
# Omit this variable if pages are deployed to the root URL
# Remember to add the leading and trailing slash
NUXT_APP_BASE_URL=/RepositoryNameHere/
```

### Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

### Production

Serve with a Node.js Server:

```bash
pnpm build
# Start server
node .output/server/index.mjs
```

Static hosting:

```bash
pnpm generate
# Serve .output/public, example:
pnpm dlx serve .output/public
```

Locally preview production build:

```bash
pnpm preview
```

### Continuous Deployment

Any pushes to the main branch of this repository will trigger the [`deploy-ghpages`](./.github/workflows/deploy-ghpages.yml) workflow to deploy the website to GitHub Pages.

Artifacts are available for download in the GitHub Actions page.
