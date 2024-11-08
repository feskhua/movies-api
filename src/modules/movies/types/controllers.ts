import { MovieResource } from '@modules/movies/resources/movie.resource';

export interface ListControllerReturnType {
  data: MovieResource[];
  meta: {
    limit: number;
    page: number;
    total: number;
  };
}
