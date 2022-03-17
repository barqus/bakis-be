const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
  // const offset = helper.getOffset(page, config.listPerPage);
  // const rows = await db.query(
  //   'SELECT * FROM tournaments OFFSET $1 LIMIT $2', 
  //   [offset, config.listPerPage]
  // );
  // const data = helper.emptyOrRows(rows);
  // const meta = {page};

  // return {
  //   data,
  //   meta
  // }

  const rows = await db.query(
    'SELECT * FROM tournaments',
  );
  const data = helper.emptyOrRows(rows);
  // const meta = {page};

  return {
    data,
    // meta
  }
}

async function create(tournament) {
  const result = await db.query(
    'INSERT INTO tournaments (name, type, region, maximum_players, registration_until, starting_date, created_by_user) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [tournament.name, tournament.type, tournament.region, tournament.maximum_players, tournament.registration_until,
    tournament.starting_date, tournament.created_by_user]
  );
  let message = 'Error in creating tournament';

  if (result.length) {
    message = 'Tournament created successfully';
  }
  
  return { message, result };
}

module.exports = {
  getMultiple,
  create
}