/*
 * Hashcode.js 1.0.2
 * https://github.com/stuartbannerman/hashcode
 *
 * Copyright 2013 Stuart Bannerman (me@stuartbannerman.com)
 * Released under the MIT license
 *
 * Date: 07-04-2013
 *
 * packaged as npm module by
 * A. Siebert, ask@touchableheroes.com
 *
 * usage:
 * ------------------------------------
 * var encode = require( 'hashcode' ).hashCode;
 * var hash = encode().value( "my string value" );
 */

// Hashes a string
export function hashEq(text: any): number {
  const str = text.toString();
  let hash = 0;
  let i;

  for (i = 0; i < str.length; i++) {
    // tslint:disable-next-line:no-bitwise
    hash = (((hash << 5) - hash) + str.charCodeAt(i)) & 0xFFFFFFFF;
  }

  return hash;
}

// Deep hashes an object
function objectEq(obj: any): number {
  let result = 0;
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      result += hashEq(property + hashCode(obj[property]));
    }
  }

  return result;
}

// Does a type check on the passed in value and calls the appropriate hash method
export function hashCode(value: object): number {
  const types: any =
    {
      string: hashEq,
      number: hashEq,
      boolean: hashEq,
      object: objectEq
      // functions are excluded because they are not representative of the state of an object
      // types 'undefined' or 'null' will have a hash of 0
    };

  const type = typeof value;
  let classNameHash = 0;

  if (type === 'object') {
    classNameHash = hashEq(value.constructor.name);
  }

  return value != null && types[type] ? types[type](value) + hashEq(type) + classNameHash : 0;
}
