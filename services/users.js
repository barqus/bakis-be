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

async function updateRole(body, id) {
  const rows = await db.query(
    'UPDATE users SET role=$1 WHERE id=$2 RETURNING *',
    [body.role, id],
  );

  const updatedUser = helper.emptyOrRows(rows);

  if (updatedUser.length <= 0) {
      throw "User not found"
  }
  return updatedUser
}

async function getAll() {

  const rows = await db.query(
    'SELECT id, username, email, activated, role FROM users;',
  );
  const data = helper.emptyOrRows(rows);

  return data
}


module.exports = {
  getUserByID,
  getAll,
  updateRole
}