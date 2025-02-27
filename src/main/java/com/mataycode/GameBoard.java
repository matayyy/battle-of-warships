package com.mataycode;

import java.util.Arrays;

public class GameBoard {

    private final int SIZE = 10;
    private char[][] board; // 'O' - ship, 'X' - shot, '-' - empty, '*' missed shot

    public GameBoard() {
        board = new char[SIZE][SIZE];
        initializeBoard();
    }

    private void initializeBoard() {
        for (int i = 0; i < SIZE; i++) {
            for (int j = 0; j < SIZE; j++) {
                board[i][j] = '-';
            }
        }
    }

    public boolean placeShip(int x, int y) {
        if (board[x][y] == '-') {
            board[x][y] = 'O';
            return true;
        }
        return false; //jeśli pole jest już zajęte
    }

    public boolean attack(int x, int y) {
        if (board[x][y] == 'O') {
            board[x][y] = 'X';
            return true; //trafiony
        }
        board[x][y] = '*';
        return false; //pudło
    }


    public void printBoard() {
        for (char[] row : board) {
            for (char cell : row) {
                System.out.print(cell + " ");
            }
            System.out.println();
        }
    }

    public boolean isGameOver() {
        for (int i =0; i < SIZE; i++) {
            for (int j =0; j < SIZE; j++) {
                if (board[i][j] == 'O') { //jeśli znajdziemy statek
                    return false;
                }
            }
        }
        return true; //brak statków oznacza koniec gry.
    }

    public char[][] getBoard() {
        return board;
    }

    @Override
    public String toString() {
        return "GameBoard{" +
                "SIZE=" + SIZE +
                ", board=" + Arrays.toString(board) +
                '}';
    }
}
