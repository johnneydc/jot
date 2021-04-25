import {DBSchema, IDBPDatabase, StoreKey, StoreNames, StoreValue} from 'idb';
import {Model} from './model';

export abstract class Repository<T extends Model, Schema extends DBSchema> {

  constructor(
    protected readonly idb: IDBPDatabase<Schema>
  ) { }

  public async save(obj: StoreValue<Schema, StoreNames<Schema>>): Promise<T> {
    await this.idb.put(this.storeName(), obj);
    return obj;
  }

  public async delete(obj: StoreValue<Schema, StoreNames<Schema>>): Promise<void> {
    await this.idb.delete(this.storeName(), (obj as any).id);
  }

  public async findById(id: StoreKey<Schema, StoreNames<Schema>>): Promise<T> {
    return this.deserialize(await this.idb.get(this.storeName(), id));
  }

  public async findAll(): Promise<T[]> {
    const entries = await this.idb.getAll(this.storeName());
    return entries.map(x => this.deserialize(x));
  }

  public async countAll(): Promise<number> {
    return (await this.idb.getAllKeys(this.storeName())).length;
  }

  // tslint:disable-next-line:typedef
  public get tx() {
    return this.idb.transaction(this.storeName(), 'readwrite');
  }

  protected abstract storeName(): StoreNames<Schema>;
  protected abstract deserialize(obj?: Partial<T>): T;
}
