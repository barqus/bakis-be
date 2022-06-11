const env = process.env;

const config = {
  db: {
    host: env.DB_HOST || 'localhost',
    port: env.DB_PORT || '5432',
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || 'postgres',
    database: env.DB_NAME || 'postgres',
    ssl: true,
  },
  listPerPage: env.LIST_PER_PAGE || 10,
  token_secret: env.TOKEN_SECRET || "secr3t@s",
  riot_key: env.RIOT_KEY || "undefined",
  twitch_client_id: env.TWITCH_CLIENT_ID || "undefined",
  twitch_secret: env.TWITCH_SECRET || "undefined",
  twitch_redirect: env.TWITCH_REDIRECT || "http://localhost:3000/twitchRedirect",
  grant_type: env.GRANT_TYPE || "authorization_code",
  host: env.HOSTNAME || "http://localhost:9000",
  fe_host: env.HOSTNAME || "http://localhost:3000",
  blob_string: env.BLOB_STRING || ""
};

module.exports = config;