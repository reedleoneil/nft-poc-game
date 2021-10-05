let rankings = {
    players: [],
    client: mqtt.connect('wss://test.mosquitto.org:8081'),
    onLoad: (options) => {
        rankings.client.subscribe('nft-poc-game/rankings/#');

        rankings.client.on("message", (topic, payload) => {
            topic = topic.split("/");
            try {
                message = JSON.parse(payload);

                console.log(topic[2]);
                console.log(message);

                if (!rankings.players.find(p => p.name == topic[2]))
                    rankings.players.push({
                        name: topic[2],
                        wins: 0,
                        draws: 0,
                        loses: 0
                    });        

                if (topic.includes('wins')) {
                    rankings.players.find(p => p.name == topic[2]).wins = message.Wins;
                }
                else if (topic.includes('draws')) {
                    rankings.players.find(p => p.name == topic[2]).draws = message.Draws;
                }
                else if (topic.includes('loses')) {
                    rankings.players.find(p => p.name == topic[2]).loses = message.Loses;
                }
            }
            catch(err) {
              console.log(err.message);
              console.log(topic);
              console.log(payload);
            }
        });
    }
}