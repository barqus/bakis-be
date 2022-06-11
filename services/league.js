const db = require('./db');
const helper = require('../helper');
const https = require('https');
const axios = require('axios');


async function getStandings() {
    const rows = await db.query(
        "SELECT * FROM participants, summoners as s, stream WHERE participants.summoner_id = s.id and participants.twitch_id = stream.id "+
        "ORDER BY array_position(array['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'], s.tier), "+ 
        "array_position(array['I', 'II', 'III', 'IV'], s.rank), s.league_points desc, (s.wins/s.losses);",
    );
    const standings = helper.emptyOrRows(rows);

    return standings
}

async function getMatchHistory(page = 1) {
    const offset = helper.getOffset(page, 6);
    const rows = await db.query(
        'SELECT * FROM played_games ORDER BY played_games.game_creation DESC OFFSET $1 LIMIT $2;',[offset, 6]
    );
    const history = helper.emptyOrRows(rows);
    console.log(history.length)

    let nextPage = Number(page)+1

    if (history.length < 6) {
        nextPage = null
    }

    const meta = {nextPage};
  

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

    return {output, meta}
}

async function getMatchHistoryFromBlob(matchInformationId) {

    return axios.get(`https://bakis.blob.core.windows.net/bakisblob/${matchInformationId}.json`)
    .then(response => {
        return response.data
    })
    .catch(error => {
        console.log(error);
    });
}


module.exports = {
    getStandings,
    getMatchHistory,
    getMatchHistoryFromBlob,
}