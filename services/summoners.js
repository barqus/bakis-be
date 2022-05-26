const db = require('./db');
const helper = require('../helper');

async function checkIfSummonerExistsByID(summonerID) {
    const rows = await db.query(
        'SELECT EXISTS(SELECT 1 FROM summoners where id=$1)', [summonerID],
    );

    return rows[0].exists
}

async function add(summoner) {
    let result = []
    console.log(summoner)
    if (summoner.miniSeries != undefined || summoner.miniSeries) {
        result = await db.query(
            'INSERT INTO summoners (summoner_name, tier, rank, league_points, wins, losses, mini_series, ms_target, ms_wins, ms_losses, ms_progress, id)' +
            ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [summoner.summonerName, summoner.tier, summoner.rank, summoner.leaguePoints, summoner.wins, summoner.losses, true, summoner.miniSeries.target,
            summoner.miniSeries.wins, summoner.miniSeries.losses, summoner.miniSeries.progress, summoner.summonerId]
        );
    } else {
        result = await db.query(
            'INSERT INTO summoners (summoner_name, tier, rank, league_points, wins, losses, mini_series, id)' +
            ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [summoner.summonerName, summoner.tier, summoner.rank, summoner.leaguePoints, summoner.wins, summoner.losses, false, summoner.summonerId]
        );
    }

    let message = 'Error in adding summoner league';

    if (result.length) {
        message = 'Summoner league added successfully';
    }

    return { message, result };
}

async function update(summoner) {
    let result = []
    if (summoner.miniSeries != undefined || summoner.miniSeries) {
        result = await db.query(
            'UPDATE summoners SET summoner_name=$1, tier=$2, rank=$3, league_points=$4, wins=$5, losses=$6,' +
            ' mini_series=$7, ms_target=$8, ms_wins=$9, ms_losses=$10, ms_progress=$11 WHERE id=$12 RETURNING *',
            [summoner.summonerName, summoner.tier, summoner.rank, summoner.leaguePoints, summoner.wins, summoner.losses, true, summoner.miniSeries.target,
                summoner.miniSeries.wins, summoner.miniSeries.losses, summoner.miniSeries.progress, summoner.summonerId],
        );
    } else {
        result = await db.query(
            'UPDATE summoners SET summoner_name=$1, tier=$2, rank=$3, league_points=$4, wins=$5, losses=$6,' +
            ' mini_series=$7 WHERE id=$8 RETURNING *',
            [summoner.summonerName, summoner.tier, summoner.rank, summoner.leaguePoints, summoner.wins, summoner.losses, false, summoner.summonerId]
        );
    }

    let message = 'Error in updating summoner league';

    if (result.length) {
        message = 'Summoner league updated successfully';
    }

    return { message, result };
}

async function deleteByID(summonerID) {
    const rows = await db.query(
        'DELETE FROM summoners WHERE id=$1 RETURNING id', [summonerID],
    );
    const deletedSummonerID= helper.emptyOrRows(rows);

    if (deletedSummonerID.length <= 0) {
        throw "Summoner not found"
    }

    return {
        deletedSummonerID,
    }
}

module.exports = {
    add,
    checkIfSummonerExistsByID,
    update,
    deleteByID
}