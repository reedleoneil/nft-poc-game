let pvpModule = {
    roomid: null,
    combatStatus: 0,
    client: mqtt.connect('wss://test.mosquitto.org:8081'),
    onLoad: (options) => {
        console.log('loaded: ' + options);

        pvpModule.client.on("message", (topic, payload) => {
            try {
              message = JSON.parse(payload);
              options.onConfirmBattle(message);
            }
            catch(err) {
              console.log(err.message);
            }
        });
    },
    joinRoom: (room) => {
        pvpModule.client.subscribe('nft-poc-game/rooms/' + room);
        pvpModule.roomid = room;
    },
    leaveroom: (room) => {
        pvpModule.client.unsubscribe('nft-poc-game/rooms/' + room);
        pvpModule.roomid = null;
    },
    onConfirmBattle: (profile) => {
        pvpModule.client.publish('nft-poc-game/rooms/' + pvpModule.roomid, JSON.stringify(profile));
    }
}