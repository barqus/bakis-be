const db = require('./db');
const helper = require('../helper');

// async function checkIfMatchExistsByID(matchID) {
//     const rows = await db.query(
//         'SELECT EXISTS(SELECT 1 FROM played_games where id=$1)', [matchID],
//     );

//     return rows[0].exists
// }

async function getAll() {
    const rows = await db.query(
        'SELECT * FROM played_team_player;',
    );
    const player = helper.emptyOrRows(rows);

    return player
}

async function getByID(playerID) {
    const rows = await db.query(
        'SELECT * FROM played_team_player WHERE id=$1', [playerID],
    );
    const player = helper.emptyOrRows(rows);

    if (player.length <= 0) {
        throw "Player not found"
    }
    return playedTeam
}


async function create(player) {
    const result = await db.query(
        'INSERT INTO played_team_player (summoner_id, summoner_name, kills, assists, deaths, gold_earned,' +
        'individual_position,lane, champ_level, champ_id, champ_name, total_damage_dealt, win, team_ID) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
        [player.summonerId, player.summonerName, player.kills, player.assists, player.deaths, player.goldEarned,
        player.individualPosition, player.lane, player.champLevel, player.champID, player.champName,
        player.totalDamageDealt, player.win, player.teamID]
    );
    let message = 'Error in creating player';

    if (result.length) {
        message = 'Player added successfully';
    }

    return { message, result };
}

module.exports = {
    getAll,
    create,
    getByID,
    // checkIfMatchExistsByID
}