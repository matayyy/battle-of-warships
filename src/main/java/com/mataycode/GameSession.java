package com.mataycode;

import java.util.Objects;
import java.util.UUID;

public class GameSession {

    private String gameId;
    private String player1;
    private String player2;
    private String currentTurn;
    private GameBoard player1Board;
    private GameBoard player2Board;

    public GameSession(String player1) {
        this.gameId = UUID.randomUUID().toString();
        this.player1 = player1;
        this.player2 = null; //oczekujemy na drugiego gracza
        this.currentTurn = player1;
        this.player1Board = new GameBoard();
        this.player2Board = new GameBoard();
    }

    public boolean isReady() {
        return player2 != null; //gra jest gotowa gdy są dostępni dwaj gracze
    }

    public void addPlayer(String player) {
        if (this.player2 == null) {
            this.player2 = player;
        }
    }

    public String geCurrentTurn() {
        return currentTurn;
    }

    public void switchTurn() {
        currentTurn = currentTurn.equals(player1) ? player2 : player1;
    }

    public String getGameId() {
        return gameId;
    }

    public boolean attack(int x, int y, String player) {
        if (player.equals(player1)) {
            return player2Board.attack(x, y); //atatujemy plansze przeciwnika
        } else if (player.equals(player2)) {
            return player1Board.attack(x, y);
        }
        return false;
    }

    public boolean placeShip(int x, int y, String player) {
        if (player.equals(player1)) {
            return player1Board.placeShip(x, y);
        } else if (player.equals(player2)) {
            return player2Board.placeShip(x, y);
        }
        return false;
    }

    public void printBoard(String player) {
        if (player.equals(player1)) {
            player1Board.printBoard();
        }
        if (player.equals(player2)) {
            player2Board.printBoard();
        }
    }

    public boolean isGameOver(String player) {
        if (player.equals(player1)) {
            return player2Board.isGameOver(); //sprawdzamy plansze przeciwnika
        } else if (player.equals(player2)) {
            return player1Board.isGameOver(); //sprawdzamy plansze przeciwnika
        }
        return false;
    }

    public GameBoard getPlayer1Board() {
        return player1Board;
    }

    public GameBoard getPlayer2Board() {
        return player2Board;
    }

    @Override
    public String toString() {
        return "GameSession{" +
                "gameId='" + gameId + '\'' +
                ", player1='" + player1 + '\'' +
                ", player2='" + player2 + '\'' +
                ", currentTurn='" + currentTurn + '\'' +
                ", player1Board=" + player1Board +
                ", player2Board=" + player2Board +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        GameSession that = (GameSession) o;
        return Objects.equals(gameId, that.gameId) && Objects.equals(player1, that.player1) && Objects.equals(player2, that.player2) && Objects.equals(currentTurn, that.currentTurn) && Objects.equals(player1Board, that.player1Board) && Objects.equals(player2Board, that.player2Board);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gameId, player1, player2, currentTurn, player1Board, player2Board);
    }
}
