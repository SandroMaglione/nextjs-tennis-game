import { userApiResponse } from '@validation/validation';
import { ErrorMessage, GamePlayers, UserApiResponse } from 'app-types';
import axios, { AxiosResponse } from 'axios';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';

const validateUserApiResponse = (
  response: AxiosResponse<unknown>
): E.Either<ErrorMessage, UserApiResponse> =>
  pipe(
    userApiResponse.decode(response.data),
    E.mapLeft(() => 'Error while validating user data')
  );

const getUserData = (
  url: string
): TE.TaskEither<ErrorMessage, UserApiResponse> =>
  pipe(
    TE.tryCatch(
      async () => axios.get(url),
      (error) => `Error while fetching user data at ${url}: ${error}`
    ),
    TE.chain((response) =>
      pipe(response, validateUserApiResponse, TE.fromEither)
    )
  );

export const getGamePlayers = (
  url: string
): TE.TaskEither<ErrorMessage, GamePlayers> =>
  pipe(sequenceT(TE.ApplySeq)(getUserData(url), getUserData(url)));
