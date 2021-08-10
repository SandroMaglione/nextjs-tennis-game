import { impl } from '@practical-fp/union-types';
import { GameState, Player, Scores } from 'app-types';
import { player1Scores } from './game';
import * as NEA from 'fp-ts/NonEmptyArray';

const scoreImpl = impl<Scores>();
const gameStateImpl = impl<GameState>();
const playerImpl = impl<Player>();

describe('Game state scores logic', () => {
  it('0-0 player1 scores', () => {
    const gameState: NEA.NonEmptyArray<GameState> = [
      gameStateImpl.game({
        player1: scoreImpl[0](),
        player2: scoreImpl[0](),
      }),
    ];
    const scores = player1Scores(gameState)[1];
    expect(gameStateImpl.game.is(scores)).toBe(true);
  });

  it('40-0 player1 scores', () => {
    const gameState: NEA.NonEmptyArray<GameState> = [
      gameStateImpl.game({
        player1: scoreImpl[40](),
        player2: scoreImpl[0](),
      }),
    ];
    const scores = player1Scores(gameState)[1];
    expect(gameStateImpl.won.is(scores)).toBe(true);
  });

  it('40-40 player1 scores', () => {
    const gameState: NEA.NonEmptyArray<GameState> = [
      gameStateImpl.game({
        player1: scoreImpl[40](),
        player2: scoreImpl[40](),
      }),
    ];
    const scores = player1Scores(gameState)[1];
    expect(gameStateImpl.deuce.is(scores)).toBe(true);
  });

  it('deuce for player2 and player1 scores', () => {
    const gameState: NEA.NonEmptyArray<GameState> = [
      gameStateImpl.deuce(playerImpl.player2()),
    ];
    const scores = player1Scores(gameState)[1];
    expect(gameStateImpl.game.is(scores)).toBe(true);
  });

  it('deuce for player1 and player1 scores', () => {
    const gameState: NEA.NonEmptyArray<GameState> = [
      gameStateImpl.deuce(playerImpl.player1()),
    ];
    const scores = player1Scores(gameState)[1];
    expect(gameStateImpl.won.is(scores)).toBe(true);
  });
});
