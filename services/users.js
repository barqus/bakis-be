const db = require('./db');
const helper = require('../helper');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const config = require('../config');
const jwt = require('jsonwebtoken');

async function getUserByID(userID) {
  const rows = await db.query(
    'SELECT id, username, email  FROM users WHERE id = $1', [userID],
  );
  var data = helper.emptyOrRows(rows);
  data = data[0]
  return {
    data,
  }
}


module.exports = {
  getUserByID
}