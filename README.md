# GlobalWatch

GlobalWatch is a web application that helps you find where movies and TV shows are streaming globally. It allows users to search for media and check availability across different regions using the TMDB API.

**Live Demo**: [https://global-watch.pages.dev](https://global-watch.pages.dev)

## Features
- **Global Availability**: Check streaming providers (Netflix, Prime, Disney+, etc.) for any country.
- **Smart Caching**: Utilizes Cloudflare KV and in-memory caching to minimize API calls and ensure fast responses.
- **Mobile Optimized**: Responsive design that works great on desktop and mobile devices.
- **Edge Runtime**: Built with Next.js and deployed on Cloudflare Pages for low-latency global access.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Deployment**: Cloudflare Pages (`@cloudflare/next-on-pages`)
- **Data Source**: TMDB API
- **Styling**: Tailwind CSS

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/saheb/global-watch.git
    cd global-watch
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env.local` file:
    ```env
    TMDB_API_KEY=your_tmdb_api_key_here
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Cloudflare Pages Preview
To test the caching and edge runtime locally:

1.  **Build the project**:
    ```bash
    npm run pages:build
    ```

2.  **Start Preview Server**:
    ```bash
    npm run pages:preview
    ```
    This runs the app locally using `wrangler`, emulating the Cloudflare Pages environment with KV support.

## Project Structure
- `app/`: Next.js App Router pages and components.
- `lib/`: Utility functions for TMDB API and Caching logic.
- `styles/`: Global styles and Tailwind configuration.

## License
Distributed under the MIT License. See `LICENSE` for more information.
