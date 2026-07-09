# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno:
https://docs.deno.com/runtime/getting_started/installation

Copy `.env.example` to `.env` and set your MongoDB connection string:

```
cp .env.example .env
```

Then start the project in development mode:

```
deno task dev
```

This will watch the project directory and restart as necessary.

### Deploy (Deno Deploy)

File `.env` is not uploaded to Deno Deploy. Set the same variables in the
project dashboard under **Settings → Environment Variables**:

| Name | Example |
| --- | --- |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0` |
| `MONGODB_DB` | `greengear` (optional) |

Add them for both **Production** and **Preview/Development** contexts if you
use branch previews. After saving, redeploy (or wait for the next deploy) so
the new values are picked up.

Also allow your Deno Deploy egress IPs (or `0.0.0.0/0` for testing) in MongoDB
Atlas → Network Access.
