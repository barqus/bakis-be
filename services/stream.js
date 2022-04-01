const db = require('./db');
const helper = require('../helper');

async function checkIfStreamExistsByChannelName(channelName) {
    const rows = await db.query(
        'SELECT EXISTS(SELECT 1 FROM stream where display_name=$1)', [channelName],
    );

    return rows[0].exists
}

async function checkIfStreamExistsByParticipant(participantID) {
    const rows = await db.query(
        'SELECT EXISTS(SELECT 1 FROM stream where participant_id=$1)', [participantID],
    );

    return rows[0].exists
}


async function create(streamInformation) {

    const result = await db.query(
        'INSERT INTO stream (twitch_id, display_name, game_name, is_live, title, started_at, ' +
        'viewers, thumbnail, participant_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [streamInformation.twitch_id, streamInformation.display_name, streamInformation.game_name,
        streamInformation.is_live, streamInformation.title, streamInformation.started_at, streamInformation.viewers,
        streamInformation.thumbnail_url, streamInformation.participant_id]
    );
    let message = 'Error in creating stream';

    if (result.length) {
        message = 'Stream added successfully';
    }

    return { message, result };
}

async function update(streamInformation, twitchID) {
    const rows = await db.query(
        'UPDATE stream SET twitch_id=$1, game_name=$2, is_live=$3, title=$4, started_at=$5,' +
        ' viewers=$6, thumbnail=$7 WHERE display_name=$8 RETURNING *',
        [twitchID, streamInformation.game_name,
        streamInformation.is_live, streamInformation.title, streamInformation.started_at, streamInformation.viewers,
        streamInformation.thumbnail_url, streamInformation.display_name],
    );
    const updateStream = helper.emptyOrRows(rows);

    if (updateStream.length <= 0) {
        throw "Stream not found"
    }
    return updateStream
}

async function updateStreamIsLiveByChannelName(status, channelName) {
    const rows = await db.query(
        'UPDATE stream SET is_live=$1 WHERE display_name=$2 RETURNING *',
        [status, channelName],
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
    checkIfStreamExistsByParticipant,
    updateStreamIsLiveByChannelName,
    update,
}