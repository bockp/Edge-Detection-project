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
 * Add Salt and Pepper Noise
 *
 * @param {number} percent - percentage of noise added to the image
 * @param {Raster} raster - Input image
 * @param {boolean} copy_mode - Used to control the copy (or not) of the image pixels
 * @usage saltAndPepper(0.05)(my_image)
 *
 * @author Jean-Christophe Taveau
 */
const saltAndPepper = (percent=0.05) => (raster,copy_mode = true) => {
  let output = T.Raster.from(raster,copy_mode);
  let pixels = output.pixelData;
  Array.from({length: Math.floor(raster.length * percent)}, x => Math.floor(Math.random() * raster.length) )
    .forEach( (x,i) => pixels[x] = (i%2==0) ? 255 : 0 );
  return output;
};


/** 
 * Adds pseudorandom, Gaussian ("normally") distributed values, with
 * mean 0.0 and the specified standard deviation, to this image or ROI. 
 * Adapted from ImageJ code (Wayne Rasband)
 */
const noise = (standardDeviation = 25.0) => (raster,copy_mode = true) => {
  // Private functions
  const inRange = (x,a_min,a_max) => (x >= a_min && x <= a_max);
  
  // Standard Normal variate using Box-Muller transform.
  const rand_bm = (variance) => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) * variance) * Math.cos( 2.0 * Math.PI * v );
  };

  let dummy = T.statistics(raster);
  let output = T.Raster.from(raster,copy_mode);
  let pixels = output.pixelData;
  let variance = standardDeviation**2;
  raster.pixelData.forEach( (px,i) => {
    do {
      pixels[i] = Math.floor(px + rand_bm(variance));
    } while (!inRange(pixels[i],0,255))
  } );
  return output;
};



    
export {noise,saltAndPepper};
