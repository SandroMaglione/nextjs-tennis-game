import * as t from 'io-ts';

export const userApiResponse = t.type({
  id: t.number,
  first_name: t.string,
  last_name: t.string,
});
