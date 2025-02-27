package com.mataycode;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    private static void testGameSession() {
        String player = "Agatka";
        GameSession game = new GameSession(player);
        System.out.println("Print GameSession: " + game);
        System.out.println("Is game ready? " + game.isReady());

        System.out.println("-----------------------------------------");

        String player2 = "Matej";
        game.addPlayer(player2);
        System.out.println("Print GameSession: " + game);
        System.out.println("Is game ready? " + game.isReady());

        System.out.println("-----------------------------------------");

        showBoard(player, game, player2);

        System.out.println("-----------------------------------------");

        System.out.println("Whose turn is?: " + game.geCurrentTurn());
        game.attack(1,1, player);
        System.out.println("Player " + player + " attacked.");
        System.out.println("Now is turn?: " + game.geCurrentTurn());

        System.out.println("-----------------------------------------");

        showBoard(player, game, player2);

        System.out.println("-----------------------------------------");

        System.out.println("Whose turn is?: " + game.geCurrentTurn());
        game.attack(1,1, player);
        System.out.println("Player " + player + " attacked.");
        System.out.println("Now is turn?: " + game.geCurrentTurn());

        System.out.println("-----------------------------------------");

        showBoard(player, game, player2);

        System.out.println("-----------------------------------------");

        System.out.println("Whose turn is?: " + game.geCurrentTurn());
        game.attack(1,1, player2);
        System.out.println("Player " + player + " attacked.");
        System.out.println("Now is turn?: " + game.geCurrentTurn());

        System.out.println("-----------------------------------------");

        showBoard(player, game, player2);

        System.out.println("-----------------------------------------");

        System.out.println("Place some ships");
        game.placeShip(0,0, player);
        game.placeShip(2,2, player);
        game.placeShip(3,3, player);
        game.placeShip(5,5, player2);
        game.placeShip(6,6, player2);
        game.placeShip(9,9, player2);

        System.out.println("-----------------------------------------");

        showBoard(player, game, player2);

        System.out.println("-----------------------------------------");

        System.out.println("Whose turn is?: " + game.geCurrentTurn());
        game.attack(0,0, player2);
        System.out.println("Player " + player2 + " attacked.");
        System.out.println("Now is turn?: " + game.geCurrentTurn());
        game.attack(9,9, player);
        System.out.println("Player " + player + " attacked.");
        System.out.println("Now is turn?: " + game.geCurrentTurn());

        System.out.println("-----------------------------------------");

        showBoard(player, game, player2);

        System.out.println("-----------------------------------------");
    }

    private static void showBoard(String player, GameSession game, String player2) {
        System.out.println("Player " + player + " board.");
        game.getPlayer1Board().printBoard();
        System.out.println("Player " + player2 + " board.");
        game.getPlayer2Board().printBoard();
    }

    private static void testGameBoard() {
        GameBoard gameBoard = new GameBoard();
        System.out.println("PRINTED NEW GAME BOARD");
        gameBoard.printBoard();

        System.out.println("PLACED FEW SHIPS");
        gameBoard.placeShip(1,1);
        gameBoard.placeShip(3,3);
        gameBoard.placeShip(5,5);
        gameBoard.placeShip(9,9);
        gameBoard.printBoard();

        System.out.println("ATTACK!");
        gameBoard.attack(0,0);
        gameBoard.attack(1,1);
        gameBoard.attack(3,3);
        gameBoard.attack(4,8);
        gameBoard.printBoard();
    }
}
