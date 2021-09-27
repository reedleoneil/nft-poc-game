let pvpModule = {
    roomid: null,
    combatStatus: 0,
    client: mqtt.connect('wss://test.mosquitto.org:8081'),
    onLoad: (options) => {
        console.log('loaded: ' + options);

        pvpModule.client.on("message", (topic, payload) => {
            try {
                message = JSON.parse(payload);
                if (topic.includes('addEditProfile')) { 
                    options.addEditProfile(message);
                }
                else if (topic.includes('getMoveResult')) {
                    options.getMoveResult(message);
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
        pvpModule.roomid = room;
    },
    leaveroom: (room) => {
        pvpModule.client.unsubscribe('nft-poc-game/rooms/' + room + '/addEditProfile');
        pvpModule.client.unsubscribe('nft-poc-game/rooms/' + room + '/getMoveResult');
        pvpModule.roomid = null;
    },
    addEditProfile: (profile) => {
        pvpModule.client.publish('nft-poc-game/rooms/' + pvpModule.roomid + '/addEditProfile', JSON.stringify(profile));
    },
    getMoveResult: (moves) => {
        pvpModule.client.publish('nft-poc-game/rooms/' + pvpModule.roomid + '/getMoveResult', JSON.stringify(moves));
    }
}