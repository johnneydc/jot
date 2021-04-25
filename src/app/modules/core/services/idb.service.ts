import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {IDBPDatabase, openDB} from 'idb';
import {AppDB} from './schema';
import {JotRepository} from '../../jot/repository/jot.repository';

@Injectable()
export class IdbService {

  private readonly dbName = environment.dbName;
  private readonly version = environment.dbVersion;

  private idb: IDBPDatabase<AppDB>;

  async initialize() {
    this.idb = await openDB<AppDB>(this.dbName, this.version, { upgrade: this.upgrade });
  }

  upgrade(db: IDBPDatabase<AppDB>) {
    JotRepository.dbSetup(db);
  }

  public get(): IDBPDatabase<AppDB> {
    return this.idb;
  }
}
