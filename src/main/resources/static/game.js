// Funkcja usuwająca statek z kontenera TODO
function removeShipFromContainer(shipHtml) {
    const shipContainer = document.querySelector(".ship-container");
    const shipElements = shipContainer.querySelectorAll(".ship");

    shipElements.forEach(ship => {
        if (ship.outerHTML === shipHtml) {
            ship.remove(); // Usuwamy statek z kontenera
        }
    });
}

//ATTACK BOARD LOOKING FOR SHIP
//BLAD PRZY UPUSZCZANIU NA PLANSZE PRZECIWNIKA (OMIJA IFY I UPUSZCZA STATEK NA TWOJA PLANSZE MIMO ALL) TODO
function attack(gameId, x, y, attacker) {
    stompClient.publish({
        destination: "/app/attack",
        body: JSON.stringify({gameId: gameId, x: x, y: y, attacker: attacker})
    })
}

//PLACE SHIP ON YOUR BOARD
function placeShipOnBoard(event, row, col, board) {
    event.preventDefault();

    const placer = document.getElementById("playerNameInput").value;
    const getGameId = document.getElementById("gameIdInput").value;
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

    // Umieszczamy statek
    for (let i = 0; i < shipSize; i++) {
        stompClient.publish({
            destination: "/app/place",
            body: JSON.stringify({gameId: getGameId, x: row, y: col + i, placer: placer})
        })
    }
    // //remove ship
    // document.querySelector(".ship[data-size='" + shipSize + "']").style.display = "none";

    // Znalezienie wszystkich statków o danym rozmiarze
    const ships = document.querySelectorAll(".ship[data-size='" + shipSize + "']");

    // Ukrycie tylko pierwszego znalezionego statku
    for (let ship of ships) {
        if (ship.style.display !== "none") {
            ship.style.display = "none";
            break; // Zatrzymanie po ukryciu jednego statku
        }
    }
}

//DRAW BOARD (CREATE NEW)
function drawBoard(board, boardId) {
    const boardDiv = document.getElementById(boardId)
    boardDiv.innerHTML = "";

    for (let row = 0; row < board.length; row++) {
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
        attack(gameId, i, j, attacker)
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

window.onload = function () {
    // Pobranie wartości z localStorage i przypisanie do inputów
    document.getElementById("playerNameInput").value = localStorage.getItem("playerName") || "BŁĄD";
    document.getElementById("gameIdInput").value = localStorage.getItem("gameId") || "BŁĄD";
};
