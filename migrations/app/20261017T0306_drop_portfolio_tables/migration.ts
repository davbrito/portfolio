#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/32b82a2f3d97dbe83d42b652f42a9560db1d47e1fa0ef1c668239b3ee6680054/contract';
import endContract from '../../snapshots/32b82a2f3d97dbe83d42b652f42a9560db1d47e1fa0ef1c668239b3ee6680054/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/32b82a2f3d97dbe83d42b652f42a9560db1d47e1fa0ef1c668239b3ee6680054/contract';
import startContract from '../../snapshots/32b82a2f3d97dbe83d42b652f42a9560db1d47e1fa0ef1c668239b3ee6680054/contract.json' with { type: 'json' };
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
