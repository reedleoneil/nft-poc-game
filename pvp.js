let pvpModule = {
    playerName: "",
    wins: 0,
    draws: 0,
    loses: 0,
    roomid: null,
    combatStatus: 0,
    client: mqtt.connect('wss://test.mosquitto.org:8081'),
    onLoad: (options) => {
        console.log('loaded: ' + options);

        pvpModule.playerName = options.playerName;

        pvpModule.client.subscribe('nft-poc-game/rankings/' + pvpModule.playerName + '/wins');
        pvpModule.client.subscribe('nft-poc-game/rankings/' + pvpModule.playerName + '/draws');
        pvpModule.client.subscribe('nft-poc-game/rankings/' + pvpModule.playerName + '/loses');

        pvpModule.client.on("message", (topic, payload) => {
            try {
                message = JSON.parse(payload);
                if (topic.includes('addEditProfile')) { 
                    options.addEditProfile(message);
                }
                else if (topic.includes('getMoveResult')) {
                    options.getMoveResult(message);
                }
                else if (topic.includes('onJoin')) {
                    options.onJoin(message);
                }
                else if (topic.includes('queue')) {
                    console.log(message);
                    pvpModule.client.unsubscribe('nft-poc-game/queue/' + pvpModule.playerName);
                    options.onMatchFound(message);
                }
                else if (topic.includes('wins')) {
                    pvpModule.wins = message.Wins;
                }
                else if (topic.includes('draw')) {
                    pvpModule.draws = message.Draws;
                }
                else if (topic.includes('loses')) {
                    pvpModule.loses = message.Loses;
                }
            }
            catch(err) {
              console.log(err.message);
              console.log(topic);
              console.log(payload);
            }
        });
    },
    joinRoom: (room) => {
        pvpModule.client.subscribe('nft-poc-game/rooms/' + room + '/addEditProfile');
        pvpModule.client.subscribe('nft-poc-game/rooms/' + room + '/getMoveResult');
        pvpModule.client.subscribe('nft-poc-game/rooms/' + room + '/onJoin');
        pvpModule.roomid = room;
        pvpModule.client.publish('nft-poc-game/rooms/' + room + '/onJoin', JSON.stringify({ Name: pvpModule.playerName }));
    },
    leaveroom: (room) => {
        pvpModule.client.unsubscribe('nft-poc-game/rooms/' + room + '/addEditProfile');
        pvpModule.client.unsubscribe('nft-poc-game/rooms/' + room + '/getMoveResult');
        pvpModule.client.unsubscribe('nft-poc-game/rooms/' + room + '/onJoin');
        pvpModule.roomid = null;
    },
    addEditProfile: (profile) => {
        pvpModule.client.publish('nft-poc-game/rooms/' + pvpModule.roomid + '/addEditProfile', JSON.stringify(profile));
    },
    getMoveResult: (moves) => {
        pvpModule.client.publish('nft-poc-game/rooms/' + pvpModule.roomid + '/getMoveResult', JSON.stringify(moves));
    },
    onJoin: () => {
        pvpModule.client.unsubscribe('nft-poc-game/rooms/' + pvpModule.roomid + '/onJoin');
        pvpModule.client.publish('nft-poc-game/rooms/' + pvpModule.roomid + '/onJoin', JSON.stringify({ Name: pvpModule.playerName }));
    },
    findMatch: () => {
        pvpModule.client.subscribe('nft-poc-game/queue/' + pvpModule.playerName);
        pvpModule.client.publish('nft-poc-game/queue', JSON.stringify({ Name: pvpModule.playerName }));
    },
    updateRankings: (result) => {
        switch(result) {
            case 'Win':
                pvpModule.client.publish('nft-poc-game/rankings/' + pvpModule.playerName + '/wins', JSON.stringify({ Wins: pvpModule.wins + 1 }), { retain: true });
                break;
            case 'Draw':
                pvpModule.client.publish('nft-poc-game/rankings/' + pvpModule.playerName + '/draws', JSON.stringify({ Draws: pvpModule.draws + 1 }), { retain: true });
                break;
            case 'Lose':
                pvpModule.client.publish('nft-poc-game/rankings/' + pvpModule.playerName + '/loses', JSON.stringify({ Loses: pvpModule.loses + 1 }), { retain: true });
                break;
        }
    }
}