# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno:
https://docs.deno.com/runtime/getting_started/installation

Start the project in development mode:

```
deno task dev
```

Seed sample products and create an admin (Deno KV, local SQLite file):

```
deno task seed
deno task create-admin <username> <password>
```

### Deploy (Deno Deploy + Deno KV)

1. In Deno Deploy: **Databases** → provision a **Deno KV** instance (e.g.
   `lean-database`) and **Assign** it to the `greengear` app (Local / main /
   Preview as needed).
2. Deploy the app. Code uses `await Deno.openKv()` — no `MONGODB_URI` needed.
3. Seed production data once (from your machine, against the remote KV):

```
# Create an access token in Deno Deploy, then:
export DENO_KV_ACCESS_TOKEN=ddo_...
export DENO_KV_URL=https://api.deno.com/v2/databases/<DATABASE_ID>/connect
deno task seed
deno task create-admin <username> <password>
```

Or create products/admins via the admin UI after creating the first admin
locally against the remote URL.

Check health: `https://<your-app>.deno.net/api/health` should return
`"ok": true`.
