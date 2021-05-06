import {Hashes} from './hashes';

export class Arrays {
  static remove<T>(item: T, arr: T[]) {
    const objHash = Hashes.generate(item);
    const index = arr.findIndex(sample => {
      const sampleHash = Hashes.generate(sample);
      return sampleHash === objHash;
    });

    if (index <= -1) {
      throw new Error('Could not remove an item from an array. Item is not found in the array.');
    }

    return arr.splice(index, 1);
  }
}
