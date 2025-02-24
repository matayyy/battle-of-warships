package com.mataycode;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);

//        pringBoardTest();

        GameSession gameSession = new GameSession("Matej");
        gameSession.addPlayer("Agatka");

        gameSession.placeShip(3,7, "Agatka");
        gameSession.printBoard("Agatka");
        System.out.printf("%n--------------------------%n");
        gameSession.printBoard("Matej");
        System.out.println(gameSession.getGameId());

    }

    private static void pringBoardTest() {
        GameBoard gameBoard = new GameBoard();
        gameBoard.printBoard();
        System.out.printf("%n--------------------------%n");

        gameBoard.placeShip(0,0);
        gameBoard.placeShip(0,1);
        gameBoard.placeShip(0,2);

        gameBoard.placeShip(0, 9);

        gameBoard.printBoard();
        System.out.printf("%n--------------------------%n");
    }
}
