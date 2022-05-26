const db = require("./db");
const helper = require("../helper");
const riot = require("./riot");
const twitch = require("./twitch");

async function getUsersPickems(userID) {
  const rows = await db.query(
    "SELECT user_id, participant_id, p.nickname, position FROM pickems " +
      "JOIN participants p on p.id = pickems.participant_id WHERE user_id=$1 ORDER BY position",
    [userID]
  );
  const usersPickems = helper.emptyOrRows(rows);

  if (usersPickems.length <= 0) {
    throw "Users pickems not found";
  }
  return usersPickems;
}

async function createUsersPickems(pickems) {
  let results = [];
  for (const element of pickems) {
    var result = await db.query(
      "INSERT INTO pickems (user_id, participant_id, position) VALUES ($1, $2, $3) RETURNING *",
      [element.user_id, element.participant_id, element.position]
    );

    results.push(result);
  }
  // const result = await db.query(
  //     'INSERT INTO pickems (user_id,participant_id,position) VALUES ($1, $2, $3) RETURNING *',
  //     [pickems.user_id, pickems.participant_id, pickems.position]
  // );
  // let message = 'Error in creating pickems';

  // if (result.length) {
  //     message = 'Pickems added successfully';
  // }

  return { results };
}

async function deleteUsersPickems(userID) {
  const rows = await db.query(
    "DELETE FROM pickems WHERE user_id=$1 RETURNING *",
    [userID]
  );

  const deletedPickemsID = helper.emptyOrRows(rows);

  if (deletedPickemsID.length <= 0) {
    throw "Pickems not found";
  }

  return {
    deletedPickemsID,
  };
}

module.exports = {
  getUsersPickems,
  createUsersPickems,
  deleteUsersPickems,
};
