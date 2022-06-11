const db = require('./db');
const helper = require('../helper');

async function checkIfStreamExistsByChannelName(channelName) {
    const rows = await db.query(
        'SELECT EXISTS(SELECT 1 FROM stream where display_name=$1)', [channelName],
    );

    return rows[0].exists
}

async function checkIfStreamExistsByID(id) {

    const rows = await db.query(
        'SELECT EXISTS(SELECT 1 FROM stream where id=$1)', [id],
    );

    return rows[0].exists
}


async function create(streamInformation) {
    if (streamInformation.isArray) {
        streamInformation = streamInformation[0]
    }

    const result = await db.query(
        'INSERT INTO stream (id, display_name, game_name, is_live, title, started_at, ' +
        'viewers, thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [streamInformation.twitch_id, streamInformation.display_name, streamInformation.game_name,
        streamInformation.is_live, streamInformation.title, streamInformation.started_at, streamInformation.viewers,
        streamInformation.thumbnail_url]
    );

    let message = 'Error in creating stream';

    if (result.length) {
        message = 'Stream added successfully';
    }

    return { message, result };
}

async function update(streamInformation, twitchID) {
    if (streamInformation.isArray) {
        streamInformation = streamInformation[0]
    }

    const rows = await db.query(
        'UPDATE stream SET display_name=$1, game_name=$2, is_live=$3, title=$4, started_at=$5,' +
        ' viewers=$6, thumbnail=$7 WHERE id=$8 RETURNING *',
        [streamInformation.display_name, streamInformation.game_name,
        streamInformation.is_live, streamInformation.title, streamInformation.started_at, streamInformation.viewers,
        streamInformation.thumbnail_url, twitchID],
    );

    const updateStream = helper.emptyOrRows(rows);

    if (updateStream.length <= 0) {
        throw "Stream not found"
    }
    return updateStream
}

async function updateStreamIsLiveByID(status, id) {
    const rows = await db.query(
        'UPDATE stream SET is_live=$1 WHERE id=$2 RETURNING *',
        [status, id],
    );
    const updatedStream = helper.emptyOrRows(rows);

    if (updatedStream.length <= 0) {
        throw "Stream not found"
    }
    return updatedStream
}

module.exports = {
    create,
    checkIfStreamExistsByChannelName,
    updateStreamIsLiveByID,
    checkIfStreamExistsByID,
    updateStreamIsLiveByID,
    update,
}