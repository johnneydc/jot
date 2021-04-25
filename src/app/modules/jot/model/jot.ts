import {formatDate} from '@angular/common';
import {Model} from '../../core/repository/model';
import {v4} from 'uuid';

export class Jot extends Model {

  id: string;
  meta: JotMeta;
  content: JotContent;

  constructor(id: string, meta: JotMeta, content: JotContent) {
    super(id);
    this.meta = meta;
    this.content = content;
  }

  static ForNow() {
    return new Jot(v4(), JotMeta.ForNow(), { body: '' });
  }
}

export class JotMeta {
  title: string;
  dateCreated: Date;
  dateModified: Date;
  author: string;

  constructor(title: string, dateCreated: Date, dateModified: Date, author: string) {
    this.title = title;
    this.dateCreated = dateCreated;
    this.dateModified = dateModified;
    this.author = author;
  }

  static ForNow() {
    const now = new Date();
    const title = `Unsaved ${formatDate(now, 'MMM d, y h:mm a', 'en')}`;
    return new JotMeta(title, now, now, '');
  }
}

export class JotContent {
  body: string;
}
