import { map } from 'lodash';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export class Response {
  public static list<T, V, M = Record<string, unknown>>(items: T[], transformer: ClassConstructor<V>, meta?: M): {
    data: V[],
    meta?: M
  } {
    return {
      data: map(items, (items) => plainToInstance(transformer, items)),
      meta: meta,
    };
  }

  public static item<T, V>(item: T, transformer: ClassConstructor<V>): V {
    return plainToInstance(transformer, item);
  }
}
