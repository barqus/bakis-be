const db = require('./db');
const helper = require('../helper');

async function getStandings() {
    const rows = await db.query(
        'SELECT * FROM participants, summoners, stream WHERE participants.summoner_id = summoners.id and participants.id = stream.participant_id;',
    );
    const standings = helper.emptyOrRows(rows);

    return standings
}

async function getMatchHistory() {
    const rows = await db.query(
        'SELECT * FROM played_games ORDER BY played_games.game_creation DESC;',
    );
    const history = helper.emptyOrRows(rows);

    var output = []


    for (const element of history) {
        let currentGame = {
            id: element.id,
            duration: element.game_duration / 60,
            start_time: element.game_creation,
            participant_id: element.participant_id,
        }

        const teamRows = await db.query(
            'select * from played_games_team where game_id=$1;', [element.id]
        );

        const teams = helper.emptyOrRows(teamRows);
        currentGame.teams = teams

        for (const team of currentGame.teams) {
            const playersRows = await db.query(
                'select * from played_team_player where team_id=$1;', [team.id]
            );
            const players = helper.emptyOrRows(playersRows);
            team.players = players
        }
        output.push(currentGame)
    }

    return output
}

module.exports = {
    getStandings,
    getMatchHistory,
}