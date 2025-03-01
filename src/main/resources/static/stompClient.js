//Tworzeie klienta stomp
const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/game',
})

//Rozpoczynanie połączenia
stompClient.activate();

//OBSŁUGA BŁĘDÓW
stompClient.onStompError = (frame) => {
    console.error('STOMP ERROR', frame)
}

//Połącz klienta stomp
stompClient.onConnect = (frame) => {
    console.log("Connected to websocket: " + frame);

    //SUBSKRYBCJA gameCreated
    stompClient.subscribe('/topic/gameCreated', (message) => {
        const gameData = JSON.parse(message.body);
        console.log("Game created: ", gameData.gameId);
        document.getElementById("gameIdDiv").style.display = "block";
        document.getElementById("gameIdInput").value = JSON.parse(message.body).gameId
        document.getElementById("gameIdDiv").innerText = JSON.parse(message.body).gameId
    })

    //SUBSKRYPCJA gameStarted
    stompClient.subscribe('/topic/gameStarted', (message) => {
        console.log("Game started: ", JSON.parse(message.body))
        document.getElementById("player1").innerText = "PLAYER 1 NAME: " + JSON.parse(message.body).player1
        document.getElementById("player2").innerText = "PLAYER 2 NAME: " + JSON.parse(message.body).player2
    })

    //REFRESH ABOUT ACTIVE GAMES
    stompClient.subscribe('/topic/getAllGames', (message) => {
        console.log("All Games: ", JSON.parse(message.body));
        document.getElementById("allGames").innerText = "All Games: " + JSON.parse(message.body)
    })

    //GET BOARD
    stompClient.subscribe('/topic/boardUpdate', (message) => {
        console.log("BOARD UPDATE: ", JSON.parse(message.body));
        const gameData = JSON.parse(message.body);
        const board1 = gameData.player1Board.board;
        const board2 = gameData.player2Board.board;
        drawBoard(board1, "board1");
        drawBoard(board2, "board2");
    })

    //ATACK
    stompClient.subscribe('/topic/attack', (message) => {
        console.log("ATTACK: ", JSON.parse(message.body));
        getBoard();
    })

    //PLACE SHIP
    stompClient.subscribe('/topic/place', (message) => {
        console.log("PLACE: ", JSON.parse(message.body));
        console.log("PLACED SHIP")
        getBoard();
    })

}