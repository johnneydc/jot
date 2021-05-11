import {Injectable} from '@angular/core';
import {environment} from '@root/environments/environment';
import {IDBPDatabase, openDB} from 'idb';
import {AppDB} from '@mod/core/services/schema';
import {JotRepository} from '@mod/jot/repo/jot.repository';

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
