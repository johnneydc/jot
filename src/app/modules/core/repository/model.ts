import {hashEq} from './hashutil';

export abstract class Model {

  public dateCreated: Date;
  public dateModified: Date;

  constructor(
    public id?: string
  ) {
    this.dateCreated = new Date();
    this.dateModified = new Date();
  }

  public hashCode(): number {
    return hashEq(this.constructor.name) + hashEq(this.id);
  }

  public equals(obj: Model): boolean {
    return this.hashCode() === obj.hashCode();
  }

  public toString(): string {
    return `${this.constructor.name}{${JSON.stringify(this)}}`;
  }

}
