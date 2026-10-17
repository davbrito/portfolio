#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1a618afee07d9850550e9341f1f6c6fe80e0622ad8a1f21934ead63e6a4a4c9d/contract';
import endContract from '../../snapshots/1a618afee07d9850550e9341f1f6c6fe80e0622ad8a1f21934ead63e6a4a4c9d/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ff7145e9d6f826f9f689b384af74c220e2254d3caa16c05ef88f1ecd46da08b6/contract';
import startContract from '../../snapshots/ff7145e9d6f826f9f689b384af74c220e2254d3caa16c05ef88f1ecd46da08b6/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Experience' }),
      this.dropTable({ schema: 'public', table: 'Proyects' }),
      this.dropTable({ schema: 'public', table: 'Skills' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
