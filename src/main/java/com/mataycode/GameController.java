package com.mataycode;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class GameController {
    private Map<String, GameSession> activeGames = new ConcurrentHashMap<>();

    @MessageMapping("/getAllGames")
    @SendTo("/topic/getAllGames")
    public Set<String> getGameIdOfStartedGames() {
        return activeGames.keySet();
    }

    //createGame(player) – tworzy nową grę i zwraca ID gry.
    @MessageMapping("/createGame")
    @SendTo("/topic/gameCreated")
    public GameSession createGame(String player) {
        GameSession game = new GameSession(player);
        activeGames.put(game.getGameId(), game);
        System.out.println("Game created");
        return game;
    }


    //joinGame(gameId, player) – drugi gracz dołącza do istniejącej gry.
    @MessageMapping("/joinGame")
    @SendTo("/topic/gameStarted")
    public GameSession joinGame(Map<String, String> payload) {
        String gameId = payload.get("gameId");
        String player = payload.get("player");

        GameSession game = activeGames.get(gameId);

        if (game != null && !game.isReady()) {
            game.addPlayer(player);
        }

        activeGames.put(gameId, game);

        System.out.println("Game started");
        System.out.println(game);
        return game;
    }


    @MessageMapping("/shoot")
    @SendTo("/topic/moveResult")
    public Map<String, Object> handleShot(Map<String, Object> payload) {
        String gameId = (String) payload.get("gameId");
        String player = (String) payload.get("player");
        int x = (int) payload.get("x");
        int y = (int) payload.get("y");

        GameSession game = activeGames.get(gameId);
        if (game == null || !game.geCurrentTurn().equals(player)) {
            return null; //nie można strzelać jeśli to nie twoja tura.
        }

        boolean hit = game.attack(x, y, player);
        game.switchTurn(); //zmiana tury

        return Map.of(
                "x", x,
                "y", y,
                "hit", hit,
                "nextTurn", game.geCurrentTurn()
        );
    }

    @MessageMapping("/placeShip")
    @SendTo("/topic/shipPlaced")
    public boolean placeShip(Map<String, Object> payload) {
        String gameId = (String) payload.get("gameId");
        String player = (String) payload.get("player");
        int x = (int) payload.get("x");
        int y = (int) payload.get("y");

        GameSession game = activeGames.get(gameId);
        if (game == null) {
            return false; //gra nie istnieje
        }

        return game.placeShip(x, y, player);
    }

    @MessageMapping("/checkGameOver")
    @SendTo("/topic/gameOver")
    public String checkGameOver(Map<String, Object> payload) {
        String gameId = (String) payload.get("gameId");
        String player = (String) payload.get("player");

        GameSession game = activeGames.get(gameId);
        if (game == null) {
            return null;
        }

        if (game.isGameOver(player)) {
            return player + " wins"; //zwracamy informacje o wygranej
        }

        return "Game is still ongoing";
    }

    @MessageMapping("/game/board")
    @SendTo("/topic/boardUpdate")
    public List<char[][]> sendEmptyBoard(Map<String, Object> payload) {

        String gameId = (String) payload.get("gameId");
        GameSession game = activeGames.get(gameId);

        //BOARD 1
        GameBoard board1 = game.getPlayer1Board();
        board1.placeShip(6,6);

        char[][] emptyBoard = new char[10][10];
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                emptyBoard[i][j] = board1.getBoard()[i][j];
            }
        }

        GameBoard board2 = game.getPlayer2Board();
        char[][] emptyBoard2 = new char[10][10];
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                emptyBoard2[i][j] = board2.getBoard()[i][j];
            }
        }

        List<char[][]> boards = new ArrayList<>();
        boards.add(emptyBoard);
        boards.add(emptyBoard2);
        return boards;
    }
}
