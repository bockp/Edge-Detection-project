/*
 *  TIMES: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of TIMES
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
 *  along with TIMES.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

/**
 * @module math
 */
 

/**
  * Fill with the pixel gray or color value depending of the raster type
  * @param {number} value - A gray or color value
  * @param {Raster} raster - Input Raster
  * @param {boolean} copy_mode - Useless, here. Only for compatibility with other process functions
  *
  * @author Jean-Christophe Taveau
  */
const fillColor = (value) => (raster,copy_mode=true) => {
  raster.pixelData.fill(value);
  return raster;
}

/**
  * Pattern `chessboard`. Must be used with T.fill(..)
  *
  * @example
  * let output = T.fill(T.chessboard)(raster)
  *
  * @author Jean-Christophe Taveau
  */
const chessboard = (px,i,x,y) => ( (Math.floor(x/16) + Math.floor(y/16)) % 2 === 0) ? 255 : 0;

/**
  * Pattern `ramp`. Must be used with T.fill(..)
  *
  * @example
  * let output = T.fill(T.ramp)(raster)
  *
  * @author Jean-Christophe Taveau
  */
const ramp = (px,i,x,y,z,w,h) => x / w * 255;

/**
  * Pattern `spiral`. Must be used with T.fill(..)
  *
  * @example
  * let output = T.fill(T.spiral)(raster)
  *
  * @author Jean-Christophe Taveau
  */
const spiral = (px,i,x,y,z,w,h,a,d) => 128 * (Math.sin(d / 10 + a * DEG)+1);

/**
  * Pattern `black`. Must be used with T.fill(..)
  *
  * @example
  * let output = T.fill(T.black)(raster)
  *
  * @author Jean-Christophe Taveau
  */
const black = (px) => 0;

/**
  * Pattern `white`. Must be used with T.fill(..)
  *
  * @example
  * let output = T.fill(T.white)(raster)
  *
  * @author Jean-Christophe Taveau
  */
const white = (px) => 255;

  
/**
  * Fill with values calculated from a function
  *
  * @param {function} func - A function
  * <p>The function may take a maximum of nine arguments:</p>
  * <ul>
  * <li>pix - Pixel value</li>
  * <li>index - Index corresponding to pix. A raster is a 1D pixels array</li>
  * <li>x - X-coordinate of pix</li>
  * <li>y - Y-coordinate of pix</li>
  * <li>z - Z-coordinate of pix if raster is in 3D</li>
  * <li>w - Width of raster</li>
  * <li>h - Height of raster</li>
  * <li>a - Angle calculated as atan2(y/x)</li>
  * <li>d - Distance to the center</li>
  * </ul>
  * @example <caption>Fill with a spiral</caption>
  * const DEG = Math.PI / 180;
  * const spiral = (pix,i,x,y,z,w,h,a,d) => 128 * (Math.sin(d / 10+ a * DEG)+1);
  * let raster = T.fill(spiral)(img.getRaster() );
  * @param {Raster} raster - Input Raster
  * @param {boolean} copy_mode - Useless, here. Only for compatibility with other process functions
  *
  * @author Jean-Christophe Taveau
  */
const fill = (func) => (raster,copy_mode=true) => {
  let w = raster.width;
  let h = raster.height;
  let nz = raster.depth || raster.nslices || 0;
  let cx = w / 2.0;
  let cy = h / 2.0;
  let cz = nz / 2.0;
  
  raster.pixelData.forEach ( (px,i,arr) => {
    let x = i % w;
    let y = Math.floor(i / w);
    let z = Math.floor( i / w / h);
    let d = Math.sqrt ((x - cx)**2 + (y - cy)**2 + (z - cz)**2);
    let a = Math.atan2(y,x);
    raster.pixelData[i] = func(px,i,x,y,z,w,h,a,d);
  });
  return raster;
};
  

/**
  * Fill with values calculated from a function
  *
  * @param {function} func - A function
  * <p>The function may take a maximum of nine arguments:</p>
  * <ul>
  * <li>pix - Pixel value</li>
  * <li>index - Index corresponding to pix. A raster is a 1D pixels array</li>
  * <li>x - X-coordinate of pix</li>
  * <li>y - Y-coordinate of pix</li>
  * <li>z - Z-coordinate of pix if raster is in 3D</li>
  * <li>w - Width of raster</li>
  * <li>h - Height of raster</li>
  * <li>a - Angle calculated as atan2(y/x)</li>
  * <li>d - Distance to the center</li>
  * </ul>
  * @example <caption>Fill with a spiral</caption>
  * const DEG = Math.PI / 180;
  * const spiral = (pix,i,x,y,z,w,h,a,d) => 128 * (Math.sin(d / 10+ a * DEG)+1);
  * let raster = T.fill(spiral)(img.getRaster() );
  * @param {Raster} raster - Input Raster
  * @param {boolean} copy_mode - Useless, here. Only for compatibility with other process functions
  *
  * @author Jean-Christophe Taveau
  */
const math = (func) => (raster,copy_mode=true) => T.fill(func)(T.Raster.from(raster,copy_mode),copy_mode);

/**
 * Image Calculator. Combine two images by operation
 *
 * @param {Raster} raster - Input Raster
 * @param {function} func - Function for computation
 * @param {Raster} raster - Input Raster
 * @param {boolean} copy_mode - Copy mode to manage memory usage.
 * @example <caption>Addition of two uint8 rasters with clamping</caption>
 * let raster3 = T.calc(raster1, (px1,px2) => T.clampUint8(px1 + px2) )(raster2)
 *
 * @author Jean-Christophe Taveau
 */
const calc = (other,func) => (raster,copy_mode=true) => {
  // TODO Assume two raster have same dimension
  let output = T.Raster.from(raster, copy_mode);
  output.pixelData.forEach( (px2,i,arr) => {
    let w = raster.width;
    let x = i % w;
    let y = Math.floor(i / w);
    let px1 = other.pixelData[i];
    output.pixelData[i] = func(px1,px2,i,x,y);
  });
  return output;
};

// Export
export {black, calc, chessboard, fill, fillColor, math, ramp, spiral, white};

