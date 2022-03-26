// import { RiotAPI, RiotAPITypes, PlatformId } from '@fightmegg/riot-api'
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
const getSummonerIDByName = async (summonerName) => {
    const summoner = await rAPI.summoner.getBySummonerName({
        region: riot.PlatformId.EUW1,
        summonerName: summonerName,
    }).catch((err) => { throw err });
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

const test = async () => {
    const s = await settings.get();
    const seconds = new Date(s.start_date) / 1000;
    console.log(seconds)

    // TODO: Start date and after update by last time updated
    let matchHistory = await rAPI.matchV5.getIdsbyPuuid({
        cluster: "europe",
        puuid: "vIKJHI4OihKYP2LVylIORWtwtbeCh0k8WYGfbKzt2cUkadzGiES5TpQwKQDYduY-kxwQ_XVTwWcstQ",
        params: {
            type: "ranked",
            count: 100,
            startTime: seconds
        }
    }).catch((err) => { console.log(err) })
    console.log(matchHistory)
}


async function updateMatchHistory(participants, startDate) {
    date = new Date(startDate)
    date.setHours(date.getHours() - 1);
    const startDateInSeconds = Math.floor(new Date(date) / 1000);
    console.log(date)

    for (const element of participants) {
        try {
            let matchHistory = await rAPI.matchV5.getIdsbyPuuid({
                cluster: "europe",
                puuid: element.riot_puuid,
                params: {
                    type: "ranked",
                    count: 100,
                    startTime: startDateInSeconds
                }
            }).catch((err) => { console.log(err) })
            console.log(matchHistory)
            matchHistory.forEach(async e => {
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
                    singleMatchInfo.info.teams.forEach(async team => {
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
                    })
                    let playedTeams = await played_team.getByGameID(singleMatchInfo.metadata.matchId).catch((err) => {console.log(err)})
                    console.log(playedTeams)
                    singleMatchInfo.info.participants.forEach(async participant => {
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
                            teamID: null
                        };
                        if (participant.win) {
                            player.teamID = (playedTeams.find(element => element.win == true)).id;
                        } else {
                            player.teamID = (playedTeams.find(element => element.win == true)).id;
                        }

                        const output = await played_team_player.create(player).catch((err) => { console.log(err)})
                        console.log(output)
                    });
                }


            });
        } catch (error) {
            continue
        }
    }
    await settings.updateMatchHistoryTime(new Date())
}

module.exports = {
    getSummonerIDByName,
    updateParticipantsLeague,
    updateMatchHistory
}