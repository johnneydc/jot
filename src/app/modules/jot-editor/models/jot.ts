export class Jot {
  meta: JotMeta;
  content: JotContent;
}

export interface JotMeta {
  title: string;
  dateCreated: Date;
  dateModified: Date;
  author: string;
}

export interface JotContent {
  body: string;
}
