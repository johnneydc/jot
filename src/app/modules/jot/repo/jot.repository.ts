import {Injectable} from '@angular/core';
import {IdbService} from '@mod/core/services/idb.service';
import {IDBPDatabase, StoreNames} from 'idb';
import {AppDB} from '@mod/core/services/schema';
import {Repository} from '@mod/core/repository/repository';
import {Jot} from '@mod/jot/model/jot';

@Injectable()
export class JotRepository extends Repository<Jot, AppDB> {

  private static storeName: StoreNames<AppDB> = 'jot';

  constructor(
    private readonly idbService: IdbService
  ) {
    super(idbService.get());
  }

  public static dbSetup(db: IDBPDatabase<AppDB>) {
    const store = db.createObjectStore(JotRepository.storeName, {
      keyPath: 'id'
    });

    store.createIndex('by-date', 'meta.dateCreated');
    store.createIndex('by-recent', 'meta.dateModified');
    store.createIndex('by-title', 'meta.title');
  }

  public async findByRecent(size = 10) {
    const recentJots = await this.idb.getAllFromIndex(this.storeName(), 'by-recent');
    return recentJots
      .sort((a, b) => (b.meta.dateModified as any) - (a.meta.dateModified as any))
      .slice();
  }

  protected deserialize(obj: Partial<Jot> | undefined): Jot {
    return undefined;
  }

  protected storeName(): StoreNames<AppDB> {
    return 'jot';
  }
}
