declare module 'app-types' {
  import('io-ts');
  import('@validation/validation');
  import('@practical-fp/union-types');
  import { TypeOf } from 'io-ts';
  import { userApiResponse } from '@validation/validation';
  import { Variant } from '@practical-fp/union-types';

  type ErrorMessage = string;
  type UserApiResponse = TypeOf<typeof userApiResponse>;
  type GamePlayers = [UserApiResponse, UserApiResponse];

  type Player = Variant<'player1'> | Variant<'player2'>;
  type Scores = Variant<'0'> | Variant<'15'> | Variant<'30'> | Variant<'40'>;

  interface GameScores {
    player1: Scores;
    player2: Scores;
  }

  type GameState =
    | Variant<'game', GameScores>
    | Variant<'deuce', Player>
    | Variant<'won', Player>;
}
