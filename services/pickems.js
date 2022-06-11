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

async function getUsersPickemsPoints(userID) {
  const rows = await db.query(
    "SELECT user_id, participant_id, p.nickname, position FROM pickems " +
      "JOIN participants p on p.id = pickems.participant_id WHERE user_id=$1 ORDER BY position",
    [userID]
  );
  const usersPickems = helper.emptyOrRows(rows);

  if (usersPickems.length <= 0) {
    throw "Users pickems not found";
  }
  const standingsQuery ="SELECT p.id, p.nickname FROM participants as p, summoners as s WHERE p.summoner_id = s.id "+ 
  "ORDER BY array_position(array['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON']::varchar[], s.tier), "+ 
  "array_position(array['I', 'II', 'III', 'IV']::varchar[], s.rank), s.league_points desc, (s.wins/s.losses);"

  const participantsSortedRows = await db.query(
    standingsQuery,
  );


  const participantsSorted = helper.emptyOrRows(participantsSortedRows);

  if (participantsSorted.length <= 0) {
    throw "Participants not found";
  }
  
  let totalPoints = 0

  participantsSorted.forEach((element, index) => {
    if (index == 3 && totalPoints == 3) {
      totalPoints = totalPoints + 3
    }
    if (element.id == usersPickems[index].participant_id) {
      totalPoints++
    }
  });

  return {totalPoints};
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
  getUsersPickemsPoints,
  deleteUsersPickems,
};
