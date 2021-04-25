import {DBSchema} from 'idb';
import {Jot} from '../../jot/model/jot';

export interface AppDB extends DBSchema {
  jot: {
    key: string;
    value: Jot,
    indexes: {
      'by-date': string,
      'by-recent': string,
      'by-title': string
    }
  };
}
