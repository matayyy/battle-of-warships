package com.mataycode;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class GameController {
    private Map<String, GameSession> activeGames = new ConcurrentHashMap<>();


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

        System.out.println("Game id: " + gameId);
        System.out.println("Active games get game: " + activeGames.get(gameId));

        if (game != null && !game.isReady()) {
            game.addPlayer(player);
        }

        System.out.println("Game started");
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

        boolean hit = game.attack(x,y, player);
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

        return game.placeShip(x, y,player);
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
    public char[][] sendBoard(String gameId) {
        GameSession game = activeGames.get(gameId);
        if (game != null) {
            return game.getPlayer1Board().getBoard();
        }
        System.out.println("return new board");
        return new char[10][10];
    }
}
