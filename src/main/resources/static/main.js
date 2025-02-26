let GameId = 0;

//Tworzeie klienta stomp
const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/game',
})

//Rozpoczynanie połączenia
stompClient.activate();

//Połącz klienta stomp
stompClient.onConnect = (frame) => {
    console.log("Connected to websocket: " + frame);

    //SUBSKRYBCJA gameCreated
    stompClient.subscribe('/topic/gameCreated', (message) => {
        const gameData = JSON.parse(message.body);
        console.log("Game created: ", gameData.gameId);
        document.getElementById("gameIdInput").value = JSON.parse(message.body).gameId
        document.getElementById("gameId").innerText = JSON.parse(message.body).gameId
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
        console.log("BOARD: ", JSON.parse(message.body));
        const board = JSON.parse(message.body);
        drawBoard(board[0], "board1");
        drawBoard(board[1], "board2");
    })

}

//OBSŁUGA BŁĘDÓW
stompClient.onStompError = (frame) => {
    console.error('STOMP ERROR', frame)
}

//------------------------------------------------------------------------------------//

function drawBoard(board, boardId) {
    const boardDiv = document.getElementById(boardId)
    boardDiv.innerHTML = "";

    for(let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell")

            cell.innerHTML = board[row][col];

            // Dodaj nasłuchiwanie na kliknięcie
            cell.onclick = () => handleCellClick(board, row, col, boardId);

            boardDiv.appendChild(cell);
        }
    }
}

// Funkcja obsługująca kliknięcie w komórkę
function handleCellClick(board, i, j, boardId) {
    if (board[i][j] === '-') {
        // board[i][j] = 'X';  // Zmieniamy wartość na 'X'
        // console.log(board)
        drawBoard(board, boardId);  // Ponownie rysujemy planszę
    }
    console.log("KLIKNIĘTO W:" + i + "/" + j)
}

function getBoard() {
    const gameId = document.getElementById("gameIdInput").value;

    stompClient.publish({
        destination: "/app/game/board",
        body: JSON.stringify({gameId: gameId})
    });
}

function getAllGames() {
    stompClient.publish({
        destination: "/app/getAllGames"
    });
}

//CREATE GAME
function createGame() {
    const player = document.getElementById("playerNameInput").value;
    stompClient.publish({
        destination: "/app/createGame",
        body: JSON.stringify(player)
    });
}

//JOIN TO GAME
function joinGame(gameId, player) {
    const playerInput = document.getElementById("playerNameInput").value;
    gameId = document.getElementById("gameIdInput").value;

    stompClient.publish({
        destination: "/app/joinGame",
        body: JSON.stringify({gameId: gameId, player: playerInput})
    })
}
