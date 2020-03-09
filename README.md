# Gatekeeper

## Setup
1. Install Postgresql, and create a user with the `CREATEDB` privilege

```
CREATE USER gatekeeper WITH PASSWORD 'changeme' CREATEDB;
```

2. Create `.env` files`

```
mv .env.example .env
mv db/.env.example db/.env
```

3. Update the username / password to match your postgres installation
```
// .env
DATABASE_URL=postgres://username:password@localhost/gatekeeper
BIND_ADDRESS=0.0.0.0:3000
// db/.env
DATABASE_URL=postgres://username:password@localhost/gatekeeper
```

4. Start the API
```
cargo run --bin gatekeeper
```

5. Install ui dependencies
```
cd ui
yarn install
```
You may need to first [install Node.js](https://docs.npmjs.com/downloading-and-ins.exampletalling-node-js-and-npm), and/or install yarn
```
npm install -g yarn
```

6. Start the frontend
```
yarn start
```

