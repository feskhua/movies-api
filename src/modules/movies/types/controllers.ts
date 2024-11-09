import { MovieTransformer } from '@modules/movies/transformers/movie.transformer';

export interface ListControllerReturnType {
  data: MovieTransformer[];
  meta: {
    limit: number;
    page: number;
    total: number;
  };
}
