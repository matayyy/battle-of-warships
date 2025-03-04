const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/game',
})

//Rozpoczynanie połączenia
stompClient.activate();

stompClient.onStompError = (frame) => {
    console.error('STOMP ERROR', frame)
}


//Połącz klienta stomp
stompClient.onConnect = (frame) => {
    console.log("Connected to websocket: " + frame);

    //PLACE SHIP
    stompClient.subscribe('/topic/place/ship', (message) => {
        console.log("SHIP PLACEMENT: ", JSON.parse(message.body));
    })

    //REMOVE SHIP
    stompClient.subscribe('/topic/remove/ship', (message) => {
        console.log("SHIP REMOVED: ", JSON.parse(message.body));
    })

    //GET GAME DATA
    stompClient.subscribe('/topic/game/data', (message) => {
        const gameData = JSON.parse(message.body)
        console.log("GAME DATA: ", gameData);
    })
}
