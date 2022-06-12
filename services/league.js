const db = require('./db');
const helper = require('../helper');
const https = require('https');
const axios = require('axios');


async function getStandings() {
    const rows = await db.query(
        "SELECT * FROM participants, summoners as s, stream WHERE participants.summoner_id = s.id and participants.twitch_id = stream.id " +
        "ORDER BY array_position(array['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON']::varchar[], s.tier), " +
        "array_position(array['I', 'II', 'III', 'IV']::varchar[], s.rank), s.league_points desc, (s.wins/s.losses);",
    );
    const standings = helper.emptyOrRows(rows);

    return standings
}

async function getMatchHistoryDetailsByID(matchID) {
    console.log(matchID)

    const rows = await db.query(
        'select * from played_games_team pgt full outer join played_team_player on played_team_player.team_id = pgt.id where pgt.game_id = $1 order by pgt.id;', [matchID]
    );


    const historyDetails = helper.emptyOrRows(rows);

    const winnerTeam = historyDetails.filter(x => x.win === true)

    const losserTeam = historyDetails.filter(x => x.win === false)

    return {
        teams: [
            {
                id: winnerTeam[0].id,
                barons_killed: winnerTeam[0].barons_killed,
                champions_killed: winnerTeam[0].champions_killed,
                towers_killed: winnerTeam[0].towers_killed,
                inhibitors_killed: winnerTeam[0].inhibitors_killed,
                dragons_killed: winnerTeam[0].dragons_killed,
                rift_heralds_killed: winnerTeam[0].rift_heralds_killed,
                win: winnerTeam[0].win,
                players: winnerTeam
            },
            {
                id: losserTeam[1].id,
                barons_killed: losserTeam[1].barons_killed,
                champions_killed: losserTeam[1].champions_killed,
                towers_killed: losserTeam[1].towers_killed,
                inhibitors_killed: losserTeam[1].inhibitors_killed,
                dragons_killed: losserTeam[1].dragons_killed,
                rift_heralds_killed: losserTeam[1].rift_heralds_killed,
                win: losserTeam[1].win,
                players: losserTeam
            },
        ],
    }
}

async function getMatchHistory(page = 1) {
    const offset = helper.getOffset(page, 6);

    const query = 'SELECT * FROM played_games full outer join played_games_team on played_games.id = played_games_team.game_id ' +
        'full outer join played_team_player on played_games_team.id = played_team_player.team_id WHERE played_team_player.is_participant = true ' +
        'ORDER BY played_games.game_creation DESC OFFSET $1 LIMIT $2;'

    console.log(query)
    const rows = await db.query(
        query, [offset, 6]
    );
    const history = helper.emptyOrRows(rows);
    console.log(history.length)

    let nextPage = Number(page) + 1

    if (history.length < 6) {
        nextPage = null
    }

    const meta = { nextPage };


    return { history, meta }

    // var output = []


    // for (const element of history) {
    //     let currentGame = {
    //         id: element.id,
    //         duration: element.game_duration / 60,
    //         start_time: element.game_creation,
    //         participant_id: element.participant_id,
    //     }

    //     const teamRows = await db.query(
    //         'select * from played_games_team where game_id=$1;', [element.id]
    //     );

    //     const teams = helper.emptyOrRows(teamRows);
    //     currentGame.teams = teams

    //     for (const team of currentGame.teams) {
    //         const playersRows = await db.query(
    //             'select * from played_team_player where team_id=$1;', [team.id]
    //         );
    //         const players = helper.emptyOrRows(playersRows);
    //         team.players = players
    //     }
    //     output.push(currentGame)
    // }

    // return {output, meta}
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
    getMatchHistoryDetailsByID,
}