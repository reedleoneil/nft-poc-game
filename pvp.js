let pvpModule = {
    playerName: "",
    roomid: null,
    combatStatus: 0,
    client: mqtt.connect('wss://test.mosquitto.org:8081'),
    onLoad: (options) => {
        console.log('loaded: ' + options);

        pvpModule.playerName = options.playerName;

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
    }
}