const cron = require('node-cron');
const riot = require('./riot')
const participants = require('./participants');
const settings = require('./settings');
const twitch = require('./twitch')

const syncParticipantsLeagueStandingsInformation = () => {
    cron.schedule('*/3 * * * *', async () => {
        console.log('Syncing participants league information ', new Date());
        const allParticipants = await participants.getAll();
        riot.updateParticipantsLeague(allParticipants.participants)
            .catch((err) => { console.log(err) })
    });
}

const syncMatchHistory = () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Syncing match history information ', new Date());

        const currentSettings = await settings.get()
        const allParticipants = await participants.getAll();

        riot.updateMatchHistory(allParticipants.participants, currentSettings.last_time_history_updated)
    });
}

const syncTwitchInformation = () => {
    cron.schedule('*/2 * * * *', async () => {
        console.log('Syncing twitch information ', new Date());
        const allParticipants = await participants.getAll();

        twitch.updateTwitchInformation(allParticipants.participants).catch((err) => {console.log(err)})

    });
}

module.exports = {
    syncParticipantsLeagueStandingsInformation,
    syncMatchHistory,
    syncTwitchInformation
}