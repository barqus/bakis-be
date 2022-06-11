const cron = require('node-cron');
const riot = require('./riot')
const participants = require('./participants');
const settings = require('./settings');
const twitch = require('./twitch')
const log = require('log-to-file');

const syncParticipantsLeagueStandingsInformation = () => {
    cron.schedule('*/1 * * * *', async () => {
        log('Syncing league information ', './sync.log');
        const allParticipants = await participants.getAll();
        riot.updateParticipantsLeague(allParticipants.participants).catch(e => {
            log("ERROR WHILE SYNCING LEAGUE", e, './sync.log');
        });
    });
}

const syncMatchHistory = () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Syncing match history information ', new Date());
        log('Syncing match history information ', './sync.log');
        const currentSettings = await settings.get()
        const allParticipants = await participants.getAll();

        riot.updateMatchHistory(allParticipants.participants, currentSettings.last_time_history_updated).catch(e => {
            log("ERROR WHILE SYNCING HISTORY", e, './sync.log');
        });
    });
}

const syncTwitchInformation = () => {
    cron.schedule('*/1 * * * *', async () => {
        log('Syncing twitch information ', './sync.log');
        const allParticipants = await participants.getAll()

        twitch.updateTwitchInformation(allParticipants.participants).catch(e => {
            log("ERROR WHILE SYNCING TWITCH", e, './sync.log');
        });

    });
}

module.exports = {
    syncParticipantsLeagueStandingsInformation,
    syncMatchHistory,
    syncTwitchInformation
}