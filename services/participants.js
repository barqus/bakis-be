const db = require('./db');
const helper = require('../helper');
const riot = require('./riot');

async function getAll() {
    const rows = await db.query(
        'SELECT * FROM participants;',
    );
    const participants = helper.emptyOrRows(rows);

    return {
        participants,
    }
}

async function getByID(participantID) {
    const rows = await db.query(
        'SELECT * FROM participants WHERE id=$1', [participantID],
    );
    const participant = helper.emptyOrRows(rows);

    if (participant.length <= 0) {
        throw "Participant not found"
    }
    return {
        participant,
    }
}


async function create(participant) {
    let summoner_information = await riot.getSummonerIDByName(participant.summoner_name)
        .catch((err) => { throw "Failed to find summoner by summoner name" })

    const result = await db.query(
        'INSERT INTO participants (name, lastname, surname, description, nickname, summoner_name, twitch_channel, instagram, twitter,' +
        ' youtube, summoner_id, riot_puuid, riot_account_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
        [participant.name, participant.lastname, participant.surname, participant.description, participant.nickname, participant.summoner_name,
        participant.twitch_channel, participant.instagram, participant.twitter, participant.youtube, summoner_information.id, summoner_information.puuid, summoner_information.accountId]
    );
    let message = 'Error in creating participant';

    if (result.length) {
        message = 'Participant added successfully';
    }

    return { message, result };
}

async function deleteByID(participantID) {
    const rows = await db.query(
        'DELETE FROM participants WHERE id=$1 RETURNING id', [participantID],
    );
    const deletedParticipantID = helper.emptyOrRows(rows);

    if (deletedParticipantID.length <= 0) {
        throw "Participant not found"
    }

    return {
        deletedParticipantID,
    }
}

async function update(participant, participantID) {
    let summoner_information = await riot.getSummonerIDByName(participant.summoner_name)
        .catch(() => { throw "Failed to find summoner by summoner name" })

    // await summoners.deleteByID()
    const rows = await db.query(
        'UPDATE participants SET name=$1, lastname=$2, surname=$3, description=$4, nickname=$5, summoner_name=$6,' +
        ' twitch_channel=$7, instagram=$8, twitter=$9, youtube=$10, summoner_id=$11, riot_puuid=$12, riot_account_id=$13 WHERE id=$14 RETURNING *',
        [participant.name, participant.lastname, participant.surname, participant.description, participant.nickname, participant.summoner_name, participant.twitch_channel, 
            participant.instagram, participant.twitter, participant.youtube, summoner_information.id, summoner_information.puuid, summoner_information.accountId, participantID],
    );
    const updatedParticipant = helper.emptyOrRows(rows);

    if (updatedParticipant.length <= 0) {
        throw "Participant not found"
    }
    return {
        updatedParticipant,
    }
}

module.exports = {
    getAll,
    getByID,
    deleteByID,
    create,
    update
}