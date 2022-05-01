const db = require('./db');
const helper = require('../helper');


// TODO: on deletion of participant delete games??
async function checkIfMatchExistsByID(matchID) {
    const rows = await db.query(
        'SELECT EXISTS(SELECT 1 FROM played_games where id=$1)', [matchID],
    );

    return rows[0].exists
}

async function getAll() {
    const rows = await db.query(
        'SELECT * FROM played_games;',
    );
    const playedGames = helper.emptyOrRows(rows);

    return playedGames
}

async function getByID(gameID) {
    const rows = await db.query(
        'SELECT * FROM played_games WHERE id=$1', [gameID],
    );
    const playedGame = helper.emptyOrRows(rows);

    if (playedGame.length <= 0) {
        throw "Participant not found"
    }
    return playedGame
}


async function create(playedGame) {
    const result = await db.query(
        'INSERT INTO played_games (id, game_duration, game_creation, participant_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [playedGame.matchID, playedGame.gameDuration, new Date(playedGame.gameCreation), playedGame.participant_id]
    );
    let message = 'Error in creating played game';

    if (result.length) {
        message = 'Played game added successfully';
    }

    return { message, result };
}

module.exports = {
    getAll,
    create,
    getByID,
    checkIfMatchExistsByID
}