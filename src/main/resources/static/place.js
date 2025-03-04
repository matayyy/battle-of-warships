document.addEventListener("DOMContentLoaded", () => {
    createGameBoard();

    const ships = document.querySelectorAll(".ship");
    //Podczas podnoszenia elementu pobieramy jego wartość ID.
    ships.forEach(ship => {
        ship.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text", event.target.id);
        })
    })

    const cells = document.querySelectorAll(".cell");
    //Każda komórka dostaje dragover i drop.
    cells.forEach(cell => {
        cell.addEventListener("dragover", allowDrop);
        cell.addEventListener("drop", (event) => handleDrop(event, cell));
    });
})



//Rysujemy tablice. Dodajemy komórki do których dodajemy informacje na temat rzędu i kolumny jaki reprezętują.
function createGameBoard() {
    const gameBoard = document.getElementById("gameBoard");

    for (let row = 0; row <10; row++) {
        for (let col =0; col <10; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            //set data
            cell.dataset.row = row;
            cell.dataset.col = col;

            gameBoard.appendChild(cell);
        }
    }
}

function allowDrop(event) {
    event.preventDefault();
}


function handleDrop(event, cell) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(draggedId);

    // Sprawdzenie i ustawienie atrybutu placed, jeśli jeszcze nie istnieje
    if (draggedElement.placed === undefined) {
        draggedElement.placed = false;
    }

    //remove placed ship
    if (draggedElement.placed) {
        const oldX = draggedElement.dataset.row;
        const oldY = draggedElement.dataset.col;
        console.log("PRZESTAWIAM STATEK");
        publishRemoveShip(oldX,oldY);
        draggedElement.placed = false;
    }

    const x = cell.dataset.row;
    const y = cell.dataset.col
    console.log("upuszczam w:", "rząd:", x, "kolumna:", y)



    if(cell.children.length === 0) {
        //SEND TO BACKEND
        publishPlaceShip(x, y);
        cell.appendChild(draggedElement);

        //set data to ship
        draggedElement.dataset.row = x;
        draggedElement.dataset.col = y;
        draggedElement.placed = true;
    } else {
        console.log("CELL ALREADY TAKEN")
    }

}

function publishRemoveShip(x, y) {
    let gameId = localStorage.getItem("gameId");
    let playerName = localStorage.getItem("playerName");

    stompClient.publish({
        destination: "/app/remove/ship",
        body: JSON.stringify({x: x, y: y, gameId: gameId, playerName: playerName})
    })
}

function publishPlaceShip(x, y) {
    let gameId = localStorage.getItem("gameId");
    let playerName = localStorage.getItem("playerName");

    stompClient.publish({
        destination: "/app/place/ship",
        body: JSON.stringify({x: x, y: y, gameId: gameId, playerName: playerName})
    })
}

function getData() {
    let gameId = localStorage.getItem("gameId");

    stompClient.publish({
        destination: "/app/game/data",
        body: JSON.stringify({gameId: gameId})
    })
}

window.onload = function () {
    let gameId = localStorage.getItem("gameId");
    let playerName = localStorage.getItem("playerName");

    stompClient.publish({
        destination: "/app/game/restart",
        body: JSON.stringify({gameId: gameId, playerName: playerName})
    })
}

function goToGame() {

    //check if all ship is placed
    if(!allShipPlaced()) {
        alert("PLEASE PLACE ALL SHIPS");
        return;
    }

    window.location.href = "game.html" // move to game.
}

function allShipPlaced() {
    return true;
}