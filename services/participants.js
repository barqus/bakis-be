const db = require('./db');
const helper = require('../helper');
const riot = require('./riot');
const twitch = require('./twitch');

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

async function getQnA(participantID) {
    // select * from questions, answers where answers.participant_id =12 and answers.question_id =questions.id ;
    const rows = await db.query(
        'select * from questions, answers where answers.participant_id=$1 and answers.question_id=questions.id ;', [participantID],
    );
    const qna = helper.emptyOrRows(rows);

    if (qna.length <= 0) {
        throw "Questions and Answers not found"
    }
    return qna
}

async function create(participant) {
    let summoner_information = await riot.getSummonerIDByName(participant.summoner_name)
        .catch((err) => { throw "Failed to find summoner by summoner name" })

    let twitchChannelExists = await twitch.checkIfChannelExists(participant.twitch_channel)
    if (twitchChannelExists === false) {
        throw "Failed to find twitch account by that channel name"
    }

    const result = await db.query(
        'INSERT INTO participants (name, surname, description, nickname, summoner_name, twitch_channel, instagram, twitter,' +
        ' youtube, summoner_id, riot_puuid, riot_account_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
        [participant.name, participant.surname, participant.description, participant.nickname, summoner_information.name,
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

    let twitchChannlExists = await twitch.checkIfChannelExists(participant.twitch_channel)
    if (twitchChannlExists === false) {
        throw "Failed to find twitch account by that channel name"
    }
    
    const rows = await db.query(
        'UPDATE participants SET name=$1, surname=$2, description=$3, nickname=$4, summoner_name=$5,' +
        ' twitch_channel=$6, instagram=$7, twitter=$8, youtube=$9, summoner_id=$10, riot_puuid=$11, riot_account_id=$12 WHERE id=$13 RETURNING *',
        [participant.name, participant.surname, participant.description, participant.nickname, summoner_information.name, participant.twitch_channel, 
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
    getQnA,
    deleteByID,
    create,
    update
}