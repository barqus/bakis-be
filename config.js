const env = process.env;

const config = {
  db: {
    host: env.DB_HOST || 'localhost',
    port: env.DB_PORT || '5432',
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || 'postgres',
    database: env.DB_NAME || 'postgres',
  },
  listPerPage: env.LIST_PER_PAGE || 10,
  token_secret: env.TOKEN_SECRET || "secr3t@s",
  riot_key: env.RIOT_KEY || "undefined",
  twitch_client_id: env.TWITCH_CLIENT_ID || "undefined",
  twitch_secret: env.TWITCH_SECRET || "undefined",
  host: env.HOSTNAME || "http://localhost:9000"
};

module.exports = config;