const db = require('./db');
const helper = require('../helper');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const config = require('../config');
const jwt = require('jsonwebtoken');

async function register(user) {
  const hashedPassword = bcrypt.hashSync(user.password, saltRounds);

  const result = await db.query(
    'INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING id',
    [user.username, user.email, hashedPassword]
  );
  let message = 'Error in registering';

  if (result.length) {
    message = 'Registered successfully';
  }
  
  return { message, result };
}

async function login(user) {
  const rows = await db.query(
    'SELECT * FROM users WHERE email = $1', [user.email],
  );
  const data = helper.emptyOrRows(rows);
  const passwordsMatch = bcrypt.compareSync(user.password, data[0].hashed_password); // false
  
  if (passwordsMatch) {
    const token = generateAccessToken({ user_id: data[0].id });
    return { token };
  } else {
    throw(Error('Error: wrong password!'));
  }
}

function generateAccessToken(user_id) {
  console.log("user_id", user_id)
  return jwt.sign(user_id, config.token_secret, { expiresIn: '1800s' });
}

module.exports = {
  register,
  login
}