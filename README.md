# Neighborhoods

## Run Locally

After cloning the repository, install the dependencies:

```bash
pnpm install
```

`.env` is a file that needs to be created in the root of the project. The easiest way is to copy the sample file:

```bash
cp .env-sample .env
```

Add your Mapbox token to `.env`:

```bash
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

Start the development server:

```bash
pnpm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).
