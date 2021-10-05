let pvpServer = {
    queue: [],
    client: mqtt.connect('wss://test.mosquitto.org:8081'),
    onLoad: (options) => {
        pvpServer.client.subscribe('nft-poc-game/queue');

        pvpServer.client.on("message", (topic, payload) => {
            try {
                message = JSON.parse(payload);
                if (topic.includes('queue')) {
                    pvpServer.queue.push(message.Name);
                    console.log(pvpServer.queue);

                    if (pvpServer.queue.length > 1) {
                        var player1 = pvpServer.queue.shift();
                        var player2 = pvpServer.queue.shift();

                        var room = Math.floor((Math.random() * options.maxRooms) + 1);

                        pvpServer.client.publish('nft-poc-game/queue/' + player1, JSON.stringify({ Id: room }));
                        pvpServer.client.publish('nft-poc-game/queue/' + player2, JSON.stringify({ Id: room }));
                    }
                }
            }
            catch(err) {
              console.log(err.message);
              console.log(topic);
              console.log(payload);
            }
        });
    },
    ping: () => {
        pvpServer.client.publish('nft-poc-game/', '');
    }
}