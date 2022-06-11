// import { RiotAPI, RiotAPITypes, PlatformId } from '@fightmegg/riot-api'
// TODO: UPDATE API KEY TO PRODUCTIONkk                         
const riot = require('@fightmegg/riot-api');
const config = require('../config');
const db = require('./db');
const participants = require('./participants');
const settings = require('./settings');
const summoners = require('./summoners');
const rAPI = new riot.RiotAPI(config.riot_key);
const played_game = require('./played_games')
const played_team = require('./played_games_team')
const played_team_player = require('./played_team_player')
const { BlobServiceClient } = require('@azure/storage-blob');

const getSummonerIDByName = async (summonerName) => {
    const summoner = await rAPI.summoner.getBySummonerName({
        region: riot.PlatformId.EUW1,
        summonerName: summonerName,
    }).catch((err) => { console.log(err); throw err }); 
    return summoner
}

const updateParticipantsLeague = async (participants) => {
    for (const element of participants) {
        try {
            const league = await rAPI.league.getEntriesBySummonerId({
                region: riot.PlatformId.EUW1,
                summonerId: element.summoner_id,
            }).catch((err) => { console.log(err) });

            const league5x5RankedSolo = league.find(element => element.queueType == "RANKED_SOLO_5x5");

            summonerExists = await summoners.checkIfSummonerExistsByID(element.summoner_id)

            if (summonerExists) {
                await summoners.update(league5x5RankedSolo)
            } else {
                await summoners.add(league5x5RankedSolo)
            }
        } catch (error) {
            console.log('error' + error);
        }
    }
}

async function updateMatchHistory(participants, startDate) {
    date = new Date(startDate)
    date.setHours(date.getHours() - 1);
    const startDateInSeconds = Math.floor(new Date(date) / 1000);
    console.log("Started updating match history from ",date )
    for (const element of participants) {
        try {
            console.log("STARTDATESECONDS:", startDateInSeconds)
            let matchHistory = await rAPI.matchV5.getIdsbyPuuid({
                cluster: "europe",
                puuid: element.riot_puuid,
                params: {
                    type: "ranked",
                    count: 100,
                    startTime: startDateInSeconds
                }
            }).catch((err) => { console.log(err) })
            console.log("found new matches: ", matchHistory)
            for (const e of matchHistory) {
                const singleMatchInfo = await rAPI.matchV5.getMatchById({
                    cluster: "europe",
                    matchId: e,
                }).catch((err) => console.log("ERR", err))

                let matchObject = {
                    matchID: singleMatchInfo.metadata.matchId,
                    gameDuration: singleMatchInfo.info.gameDuration,
                    gameCreation: singleMatchInfo.info.gameCreation,
                    participant_id: element.id
                }

                matchExists = await played_game.checkIfMatchExistsByID(singleMatchInfo.metadata.matchId)

                if (!matchExists) {
                    await played_game.create(matchObject)
                    for (const team of singleMatchInfo.info.teams) {
                        let teamObject = {
                            baronsKilled: team.objectives.baron.kills,
                            championsKilled: team.objectives.champion.kills,
                            towersKilled: team.objectives.tower.kills,
                            inhibitorsKilled: team.objectives.inhibitor.kills,
                            dragonsKilled: team.objectives.dragon.kills,
                            riftHeraldsKilled: team.objectives.riftHerald.kills,
                            matchID: singleMatchInfo.metadata.matchId,
                            win: team.win
                        }
                        await played_team.create(teamObject)
                    }

                    let playedTeams = await played_team.getByGameID(singleMatchInfo.metadata.matchId).catch((err) => { console.log("errorra", err) })

                    for (const participant of singleMatchInfo.info.participants) {
                        var player = {
                            summonerId: participant.summonerId,
                            summonerName: participant.summonerName,
                            kills: participant.kills,
                            assists: participant.assists,
                            deaths: participant.deaths,
                            goldEarned: participant.goldEarned,
                            individualPosition: participant.individualPosition,
                            lane: participant.lane,
                            champLevel: participant.champLevel,
                            champID: participant.championId,
                            champName: participant.championName,
                            totalDamageDealt: participant.totalDamageDealt,
                            win: participant.win,
                            teamID: null,
                            isParticipant: false,
                        };
                        if (participant.win) {
                            player.teamID = (playedTeams.find(element => element.win == true)).id;
                        } else {
                            player.teamID = (playedTeams.find(element => element.win == false)).id;
                        }
                        if (participants.some(e => e.summoner_id === player.summonerId)) {
                            player.isParticipant = true;
                        }
                        await played_team_player.create(player).catch((err) => { console.log(err) })
                    }
                }

                uploadTimelineToBlob(e)
            }
        } catch (error) {
            console.log(error)
            continue
        }
    }
    await settings.updateMatchHistoryTime(new Date())
    console.log("Finished updating match history")

}
const uploadTimelineToBlob = async (matchID) => {
    const singleMatchTimeline = await rAPI.matchV5.getMatchTimelineById({
        cluster: "europe",
        matchId: matchID,
    }).catch((err) => { throw "ERR" })
    var jsonContent = JSON.stringify(singleMatchTimeline);

    const AZURE_STORAGE_CONNECTION_STRING = config.blob_string
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );

    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error("Azure Storage Connection string not found");
    }

    // Create a unique name for the blob
    const blobName = singleMatchTimeline.metadata.matchId + ".json";

    const containerClient = blobServiceClient.getContainerClient("bakisblob");
    // // Get a block blob client
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);


    console.log("\nUploading to Azure storage as blob:\n\t", blobName);
    const blobOptions = {
        blobHTTPHeaders: { blobContentType: 'application/json' },
    };
    const uploadBlobResponse = await blockBlobClient.upload(jsonContent, jsonContent.length, blobOptions);
    console.log(
        "Blob was uploaded successfully. requestId: ",
        uploadBlobResponse.requestId
    );
}

module.exports = {
    getSummonerIDByName,
    updateParticipantsLeague,
    updateMatchHistory
}