package com.mataycode;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;


@RestController
@RequestMapping("/api/game")
public class GameController {
    private Map<String, GameSession> activeGames = new ConcurrentHashMap<>();

    @PostMapping("/create")
    public ResponseEntity<GameSession> createGameRest(@RequestBody Map<String, String> payload) {
        String player = payload.get("player");
        GameSession game = new GameSession(player);
        activeGames.put(game.getGameId(), game);
        return ResponseEntity.ok(game);
    }

    @GetMapping("/games")
    public ResponseEntity<Set<String>> getGamesRest() {
        return ResponseEntity.ok(activeGames.keySet());
    }

    @PostMapping("/join")
    public ResponseEntity<GameSession> joinGameRest(@RequestBody Map<String, String> payload) {
        String gameId = payload.get("gameId");
        String player = payload.get("player");

        GameSession game = activeGames.get(gameId);

        //ASSIGN PLAYER2 IF GAME NOT STARTED
        if (game != null && !game.isReady()) {
            game.addPlayer(player);
        }

        activeGames.put(gameId, game);

        return ResponseEntity.ok(game);
    }


//    ----------------------------------------------------------------------------------------

    //GET ALL STARTED GAMES() RETURN SET<ID'S> OF GAMES
    @MessageMapping("/game/data")
    @SendTo("/topic/game/data")
    public GameSession getGameData(Map<String, String> payload) {
        return activeGames.get(payload.get("gameId"));
    }

    //GET ALL STARTED GAMES() RETURN SET<ID'S> OF GAMES
    @MessageMapping("/getAllGames")
    @SendTo("/topic/getAllGames")
    public Set<String> getGameIdOfStartedGames() {
        return activeGames.keySet();
    }

    //CREATE GAME(STRING PLAYER_NAME) RETURN GAME SESSION
    @MessageMapping("/createGame")
    @SendTo("/topic/gameCreated")
    public GameSession createGame(Map<String, String> payload) {

        String player = payload.get("player");
        GameSession game = new GameSession(player);
        activeGames.put(game.getGameId(), game);

        return game;
    }

    //JOIN GAME(STRING GAME ID, STRING PLAYER) RETURN GAME SESSION
    @MessageMapping("/joinGame")
    @SendTo("/topic/gameStarted")
    public GameSession joinGame(Map<String, String> payload) {
        String gameId = payload.get("gameId");
        String player = payload.get("player");

        GameSession game = activeGames.get(gameId);

        //ASSIGN PLAYER2 IF GAME NOT STARTED
        if (game != null && !game.isReady()) {
            game.addPlayer(player);
        }

        activeGames.put(gameId, game);

        return game;
    }

    //SEND BOARD(STRING GAME_ID) RETURN GAME SESSION
    @MessageMapping("/game/board")
    @SendTo("/topic/boardUpdate")
    public GameSession sendEmptyBoard(Map<String, Object> payload) {

        String gameId = (String) payload.get("gameId");

        return activeGames.get(gameId);
    }


    //ATTACK ENEMY BOARD(STRING GAME_ID, INT coordinateX, INY coordinateY, STRING ATTACKER)
    @MessageMapping("/attack")
    @SendTo("/topic/attack")
    public GameSession attack(Map<String, Object> payload) {

        String gameId = (String) payload.get("gameId");
        String attacker = (String) payload.get("attacker");

        GameSession game = activeGames.get(gameId);

        int x = (Integer) payload.get("x");
        int y = (Integer) payload.get("y");

        System.out.println("attacker: " + attacker + " x: " + x + " y: " + y);

        game.attack(x,y, attacker);

        return game;
    }

    //ATTACK ENEMY BOARD(STRING GAME_ID, INT coordinateX, INY coordinateY, STRING ATTACKER)
    @MessageMapping("/place")
    @SendTo("/topic/place")
    public GameSession placeShip(Map<String, Object> payload) {

        String gameId = (String) payload.get("gameId");
        String placer = (String) payload.get("placer");

        GameSession game = activeGames.get(gameId);

        int x = (Integer) payload.get("x");
        int y = (Integer) payload.get("y");

        System.out.println("placer: " + placer + " x: " + x + " y: " + y);

        game.placeShip(x,y, placer);

        return game;
    }



//    @MessageMapping("/placeShip")
//    @SendTo("/topic/shipPlaced")
//    public boolean placeShip(Map<String, Object> payload) {
//        String gameId = (String) payload.get("gameId");
//        String player = (String) payload.get("player");
//        int x = (int) payload.get("x");
//        int y = (int) payload.get("y");
//
//        GameSession game = activeGames.get(gameId);
//        if (game == null) {
//            return false; //gra nie istnieje
//        }
//
//        return game.placeShip(x, y, player);
//    }




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
}
