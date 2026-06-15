import * as migration_20260601_205436_initial from './20260601_205436_initial';
import * as migration_20260611_add_contact_phone_country from './20260611_add_contact_phone_country';

export const migrations = [
  {
    up: migration_20260601_205436_initial.up,
    down: migration_20260601_205436_initial.down,
    name: '20260601_205436_initial'
  },
  {
    up: migration_20260611_add_contact_phone_country.up,
    down: migration_20260611_add_contact_phone_country.down,
    name: '20260611_add_contact_phone_country'
  },
];
