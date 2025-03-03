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

    const container = document.getElementById("container")
})



//Rysujemy tablice. Dodajemy komórki do których dodajemy informacje na temat rzędu i kolumny jaki reprezętują.
function createGameBoard() {
    const gameBoard = document.getElementById("gameBoard");

    for (let row = 1; row <=10; row++) {
        for (let col =1; col <= 10; col++) {
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

    console.log("upuszczam w:", "rząd:", cell.dataset.row, "kolumna:",cell.dataset.col)

    if (draggedElement.dataset.size == 1) {
        if(cell.children.length === 0) {
            cell.appendChild(draggedElement);
        } else {
            console.log("CELL ALREADY TAKEN")
        }
    }

    if (draggedElement.dataset.size == 2) {

        if (cell.children.length === 0 && checkNextCell()) {
            cell.appendChild(draggedElement);
            return;
        }
        console.log("NO ENOUGH SPACE");

        // if(cell.children.length === 0 && getNextCell()) {
        //     console.log(draggedElement.dataset.size)
        //     cell.appendChild(draggedElement);
        // } else {
        //     console.log("CELL ALREADY TAKEN")
        // }
    }



    // if(cell.children.length === 0) {
    //     console.log(draggedElement.dataset.size)
    //     cell.appendChild(draggedElement);
    // } else {
    //     console.log("CELL ALREADY TAKEN")
    // }

    function checkNextCell() {
        const row = cell.dataset.row;
        const col = parseInt(cell.dataset.col) + 1; // Przekształcamy na liczbę, a potem dodajemy 1

        return !!document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

}


