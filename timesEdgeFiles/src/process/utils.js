/*
 *  times: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of times
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with times.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

'use strict';

import {TIMES} from '../TIMES';


/**
 * Extract alpha (transparency) component of RGBA pixel value
 */
const append = function (obj) {
  TIMES.storage.push(obj);
  return TIMES.storage;
}

/**
 * Clamp value between min and max
 *
 * @author Jean-Christophe Taveau
 */
const clamp = (min_value,max_value) => (value) => Math.max(min_value,Math.min(value,max_value));


/**
 * Clamp value between 0 and 255 (2^8 -1)
 *
 * @author Jean-Christophe Taveau
 */
const clampUint8 = clamp(0,255);


/**
 * Clamp value between 0 and 65535 (2^16 -1)
 *
 * @author Jean-Christophe Taveau
 */
const clampUint16 = clamp(0,65535);

/**
 * Check Endianness
 *
 * @author Jean-Christophe Taveau
 */
const isLittleEndian = () => {
  const checkEndianness = () => {
    // https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
    let buf = new ArrayBuffer(4);
    let buf8 = new Uint8ClampedArray(buf);
    let data = new Uint32Array(buf);
    
    // Determine whether Uint32 is little- or big-endian.
    data[0] = 0x0a0b0c0d;
    TIMES.cache.littleEndian = (buf8[0] === 0x0d);
    return TIMES.cache.littleEndian;
  };
  
  return (TIMES.cache.littleEndian !== undefined) ? TIMES.cache.littleEndian : checkEndianness();

};

/**
 * pipe(func1, func2, func3, ..., funcn)
 * From https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
 *
 * @example pipe(func1,func2) returns func2(func1(x))
 *
 * @author Eric Elliott
 */
const pipe = (...fns) => (x,copy_mode=false) => fns.reduce((v, f,i) => {
  return f(v,copy_mode);
  }, x);



// Exports
export {clamp,clampUint8,isLittleEndian,pipe};

