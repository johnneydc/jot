import {Injectable} from '@angular/core';
import {IdbService} from '../../core/services/idb.service';
import {IDBPDatabase, StoreNames} from 'idb';
import {AppDB} from '../../core/services/schema';
import {Repository} from '../../core/repository/repository';
import {Jot} from '../model/jot';

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

  protected deserialize(obj: Partial<Jot> | undefined): Jot {
    return undefined;
  }

  protected storeName(): StoreNames<AppDB> {
    return 'jot';
  }
}
