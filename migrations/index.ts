import * as migration_20260601_205436_initial from './20260601_205436_initial';

export const migrations = [
  {
    up: migration_20260601_205436_initial.up,
    down: migration_20260601_205436_initial.down,
    name: '20260601_205436_initial'
  },
];
