import { impl, matchExhaustive } from '@practical-fp/union-types';
import { GameState, Player, Scores } from 'app-types';
import { append } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import * as NEA from 'fp-ts/NonEmptyArray';

const scoreImpl = impl<Scores>();
const gameStateImpl = impl<GameState>();
const playerImpl = impl<Player>();

const scorePoints =
  (player: Player) =>
  (gameState: GameState): GameState =>
    matchExhaustive(gameState, {
      game: ({ player1, player2 }) =>
        matchExhaustive(player, {
          player1: () =>
            matchExhaustive(player1, {
              '0': () =>
                gameStateImpl.game({ player2, player1: scoreImpl[15]() }),
              '15': () =>
                gameStateImpl.game({ player2, player1: scoreImpl[30]() }),
              '30': () =>
                gameStateImpl.game({ player2, player1: scoreImpl[40]() }),
              '40': () =>
                scoreImpl[40].is(player2)
                  ? gameStateImpl.deuce(player)
                  : gameStateImpl.won(player),
            }),
          player2: () =>
            matchExhaustive(player2, {
              '0': () =>
                gameStateImpl.game({ player1, player2: scoreImpl[15]() }),
              '15': () =>
                gameStateImpl.game({ player1, player2: scoreImpl[30]() }),
              '30': () =>
                gameStateImpl.game({ player1, player2: scoreImpl[40]() }),
              '40': () =>
                scoreImpl[40].is(player1)
                  ? gameStateImpl.deuce(player)
                  : gameStateImpl.won(player),
            }),
        }),
      deuce: (ply): GameState =>
        ply.tag === player.tag
          ? gameStateImpl.won(player)
          : gameStateImpl.game({
              player1: scoreImpl[40](),
              player2: scoreImpl[40](),
            }),
      won: () => gameState,
    });

const playerScores =
  (player: Player) =>
  (gameState: NEA.NonEmptyArray<GameState>): NEA.NonEmptyArray<GameState> =>
    pipe(
      gameState,
      append<GameState>(pipe(gameState, NEA.last, scorePoints(player)))
    );

export const player1Scores = (
  gameState: NEA.NonEmptyArray<GameState>
): NEA.NonEmptyArray<GameState> =>
  playerScores(playerImpl.player1())(gameState);

export const player2Scores = (
  gameState: NEA.NonEmptyArray<GameState>
): NEA.NonEmptyArray<GameState> =>
  playerScores(playerImpl.player2())(gameState);
