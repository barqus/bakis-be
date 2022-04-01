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
        'SELECT * FROM played_games_team;',
    );
    const playedTeam = helper.emptyOrRows(rows);

    return playedTeam
}

async function getByGameID(gameID) {
    const rows = await db.query(
        'SELECT id, win FROM played_games_team WHERE game_id=$1', [gameID],
    );
    const playedTeam = helper.emptyOrRows(rows);

    if (playedTeam.length <= 0) {
        throw "Played team not found"
    }
    return playedTeam
}




async function create(playedTeam) {
    const result = await db.query(
        'INSERT INTO played_games_team (barons_killed, champions_killed, towers_killed, inhibitors_killed, dragons_killed, ' +
        'rift_heralds_killed, win, game_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [playedTeam.baronsKilled, playedTeam.championsKilled, playedTeam.towersKilled, playedTeam.inhibitorsKilled,
        playedTeam.dragonsKilled, playedTeam.riftHeraldsKilled, playedTeam.win, playedTeam.matchID]
    );
    let message = 'Error in creating played team';

    if (result.length) {
        message = 'Played team added successfully';
    }

    return { message, result };
}

module.exports = {
    getAll,
    create,
    getByGameID,
    // checkIfMatchExistsByID
}