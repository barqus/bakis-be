const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider } = require('twitch-auth');
const config = require('../config');
const authProvider = new ClientCredentialsAuthProvider(config.twitch_client_id, config.twitch_secret);
const apiClient = new ApiClient({ authProvider });
const stream = require('./stream');

const updateTwitchInformation = async (participants) => {
    participants.forEach(async element => {
        const twitchChannel = await getTwitchInfoByChannelName(element.twitch_channel)
        if (twitchChannel !== false) {
            let streamInformation = await twitchChannel.getStream()
            if (streamInformation == null) {
                channelExists = await stream.checkIfStreamExistsByParticipant(element.id)
                if (channelExists) {
                    await stream.updateStreamIsLiveByChannelName(false, twitchChannel.displayName)
                    // await stream.update(streamInformationObject, st+reamInformationObject.twitch_id)
                } else {
                    let streamInformationObject = {
                        twitch_id: twitchChannel.id,
                        display_name: twitchChannel.displayName,
                        is_live: false,
                        participant_id: element.id
                    }
                    await stream.create(streamInformationObject)
                }
            } else {
                let streamInformationObject = {
                    twitch_id: streamInformation.id,
                    display_name: streamInformation.userDisplayName,
                    game_name: streamInformation.gameName,
                    is_live: true,
                    title: streamInformation.title,
                    started_at: streamInformation.startDate,
                    viewers: streamInformation.viewers,
                    thumbnail_url: streamInformation.thumbnailUrl,
                    participant_id: element.id
                }

                channelExists = await stream.checkIfStreamExistsByChannelName(streamInformation.userDisplayName)
                if (channelExists) {
                    await stream.update(streamInformationObject, streamInformationObject.twitch_id)
                } else {
                    await stream.create(streamInformationObject)
                }
            }
        }
    });
}

async function getTwitchInfoByChannelName(userName) {
    const user = await apiClient.helix.users.getUserByName(userName).catch((err) => { console.log("ERRRR", err) });
    if (!user) {
        return false;
    }

    return user
} 

async function checkIfChannelExists(userName) {
    const user = await apiClient.helix.users.getUserByName(userName).catch((err) => { console.log("ERRRR", err) });
    if (!user) {
        return false;
    }
    return true
}

module.exports = {
    updateTwitchInformation,
    checkIfChannelExists,
}