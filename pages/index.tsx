import { GetServerSidePropsResult } from 'next';
import { ReactElement, ReactNode, useState } from 'react';
import * as E from 'fp-ts/Either';
import * as NEA from 'fp-ts/NonEmptyArray';
import { ErrorMessage, GamePlayers, GameState, Scores } from 'app-types';
import { pipe } from 'fp-ts/lib/function';
import { getGamePlayers } from 'actions/actions';
import { impl, matchExhaustive } from '@practical-fp/union-types';
import { player1Scores, player2Scores } from 'computations/game';

const scoreImpl = impl<Scores>();
const gameStateImpl = impl<GameState>();

interface PageProps {
  gamePlayers: E.Either<ErrorMessage, GamePlayers>;
}

export default function Home({ gamePlayers }: PageProps): ReactElement {
  const [score, setScore] = useState<NEA.NonEmptyArray<GameState>>([
    gameStateImpl.game({ player1: scoreImpl[0](), player2: scoreImpl[0]() }),
  ]);
  const onClickScorePlayer1 = (): void => setScore(player1Scores);
  const onClickScorePlayer2 = (): void => setScore(player2Scores);
  return (
    <div className="flex justify-center my-12 mx-14">
      <div>
        {pipe(
          gamePlayers,
          E.fold(
            (error) => <span>{error}</span>,
            ([pl1, pl2]) => (
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-center gap-10">
                  <div className="text-center">
                    <h2 className="text-lg font-bold tracking-wide text-gray-800">{`${pl1.first_name} ${pl1.last_name}`}</h2>
                    <button
                      type="button"
                      className="btn"
                      onClick={onClickScorePlayer1}
                    >
                      Score Player 1
                    </button>
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-bold tracking-wide text-gray-800">{`${pl2.first_name} ${pl2.last_name}`}</h2>
                    <button
                      type="button"
                      className="btn"
                      onClick={onClickScorePlayer2}
                    >
                      Score Player 2
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {pipe(
                    score,
                    NEA.mapWithIndex((gameIndex, gameState) => (
                      <div
                        key={gameIndex}
                        className="flex items-center gap-4 border border-gray-200 shadow rounded-2xl bg-gray-50"
                      >
                        {matchExhaustive(gameState, {
                          game: ({ player1, player2 }): ReactNode => (
                            <>
                              <div className="flex-1 py-2 text-center border border-gray-200 bg-gray-50 rounded-2xl">
                                <span className="text-lg font-black tracking-widest text-gray-900">
                                  {player1.tag}
                                </span>
                              </div>
                              <div className="flex-1 py-2 text-center border border-gray-200 bg-gray-50 rounded-2xl">
                                <span className="text-lg font-black tracking-widest text-gray-900">
                                  {player2.tag}
                                </span>
                              </div>
                            </>
                          ),
                          deuce: (ply): ReactNode => (
                            <div className="flex items-center justify-center w-full px-3 py-3">
                              <span className="text-sm font-black tracking-widest text-red-600">{`${ply.tag} has the set point`}</span>
                            </div>
                          ),
                          won: (ply): ReactNode => (
                            <div className="flex items-center justify-center w-full px-3 py-3">
                              <span className="text-sm font-black tracking-widest text-yellow-500">{`${ply.tag} has won the set`}</span>
                            </div>
                          ),
                        })}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

const SOURCE_URL = 'https://random-data-api.com/api/users/random_user';
export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<PageProps>
> {
  return pipe(
    await getGamePlayers(SOURCE_URL)(),
    (either): GetServerSidePropsResult<PageProps> => ({
      props: {
        gamePlayers: either,
      },
    })
  );
}
