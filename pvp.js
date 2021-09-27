let pvpModule = {
    roomid: null,
    combatStatus: 0,
    client: mqtt.connect('wss://test.mosquitto.org:8081'),
    onLoad: (options) => {
        console.log('loaded: ' + options);

        pvpModule.client.on("message", (topic, payload) => {
            try {
                if (topic.includes('addEditProfile')) { 
                    message = JSON.parse(payload);
                    options.addEditProfile(message);
                }
                else if (topic.includes('combatStatus')) {
                    options.getMoveResult();
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
        pvpModule.client.subscribe('nft-poc-game/rooms/' + room + '/combatStatus');
        pvpModule.roomid = room;
    },
    leaveroom: (room) => {
        pvpModule.client.unsubscribe('nft-poc-game/rooms/' + room + '/addEditProfile');
        pvpModule.client.unsubscribe('nft-poc-game/rooms/' + room + '/combatStatus');
        pvpModule.roomid = null;
    },
    addEditProfile: (profile) => {
        pvpModule.client.publish('nft-poc-game/rooms/' + pvpModule.roomid + '/addEditProfile', JSON.stringify(profile));
    },
    getMoveResult: () => {
        pvpModule.client.publish('nft-poc-game/rooms/' + pvpModule.roomid + '/combatStatus', '');
    }
}