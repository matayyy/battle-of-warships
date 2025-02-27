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
    stompClient.subscribe('/topic/plcae', (message) => {
        console.log("PLACE: ", JSON.parse(message.body));
        console.log("PLACED SHIP")
        getBoard();
    })

}

//OBSŁUGA BŁĘDÓW
stompClient.onStompError = (frame) => {
    console.error('STOMP ERROR', frame)
}

//------------------------------------------------------------------------------------//

function attack(gameId, x, y, attacker) {
    stompClient.publish({
        destination: "/app/attack",
        body: JSON.stringify({gameId: gameId, x: x, y: y, attacker: attacker})
    })
}

function place(gameId, x, y, placer) {
    stompClient.publish({
        destination: "/app/place",
        body: JSON.stringify({gameId: gameId, x: x, y: y, placer: placer})
    })
}

function drawBoard(board, boardId) {
    const boardDiv = document.getElementById(boardId)
    boardDiv.innerHTML = "";

    for(let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell")

            cell.innerHTML = board[row][col];

            // Obsługa przeciągania
            cell.ondragover = (e) => e.preventDefault();
            cell.ondrop = (e) => placeShipOnBoard(e, row, col, board);

            // Dodaj nasłuchiwanie na kliknięcie
            cell.onclick = () => handleCellClick(board, row, col, boardId);

            boardDiv.appendChild(cell);
        }
    }
}

function placeShipOnBoard(event, row, col, board) {
    event.preventDefault();
    let boardSize = 10;
    const size = event.dataTransfer.getData("size");

    if (!size) {
        console.log("BŁĄD: Nie udało się pobrać rozmiaru statku!");
        return;
    }

    const shipSize = parseInt(size, 10);
    console.log(`Próba umieszczenia statku ${shipSize} na ${row}, ${col}`);

    if (isNaN(shipSize)) {
        console.log("BŁĄD: Pobranie rozmiaru statku zwróciło NaN!");
        return;
    }

    // Sprawdzamy, czy statek mieści się poziomo
    if (col + shipSize > boardSize) {
        console.log("Za mało miejsca na statek!");
        return;
    }

    // Sprawdzamy, czy pola są wolne
    for (let i = 0; i < shipSize; i++) {
        if (board[row][col + i] !== '-') {
            console.log("Miejsce zajęte!");
            return;
        }
    }

    const placer = document.getElementById("playerNameInput").value;
    const getGameId = document.getElementById("gameIdInput").value;
    // Umieszczamy statek
    for (let i = 0; i < shipSize; i++) {
        place(getGameId, row, col + i, placer)
    }

}

// // Obsługa przeciągania statków
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".ship").forEach(ship => {
        ship.addEventListener("dragstart", (event) => {
            console.log("Dragstart działa!"); // Sprawdź, czy to się loguje
            event.dataTransfer.setData("size", event.target.getAttribute("data-size"));
            event.dataTransfer.setData("ship", event.target.outerHTML); // Przechowywanie HTML statku
        });
    });
});

// Funkcja obsługująca kliknięcie w komórkę
function handleCellClick(board, i, j, boardId) {
    if (board[i][j] === '-') {
        // board[i][j] = 'X';  // Zmieniamy wartość na 'X'
        // console.log(board)
        let gameId = document.getElementById("gameIdInput").value;
        let attacker = document.getElementById("playerNameInput").value;
        attack(gameId,i,j, attacker)
        drawBoard(board, boardId);  // Ponownie rysujemy planszę
    }
    console.log("KLIKNIĘTO W:" + i + "/" + j)
}

//REFRESH BOARD
function getBoard() {
    const gameId = document.getElementById("gameIdInput").value;

    stompClient.publish({
        destination: "/app/game/board",
        body: JSON.stringify({gameId: gameId})
    });
}

//FETCH ALL RUNNING GAMES
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
        body: JSON.stringify({player: player})
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
