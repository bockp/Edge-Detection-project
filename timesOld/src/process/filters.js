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
 * @module filters
 */
 
/**
 * Convolve operation
 *
 * @param {TRaster} kernel - Convolution mask
 * @param {TRaster} img - Input image to process
 * @param {boolean} copy - Copy mode to manage memory usage
 * @return {TRaster} - Filtered Image
 *
 * @author TODO
 */
const convolve = (kernel) => (img,copy=true) => {
  let ouput =  TRaster.from(img,copy);
  // TODO
  return output;
}

/**
 * Gaussian Blur Filter
 *
 * @param {TRaster} kernel - Convolution mask
 * @param {TRaster} img - Input image to process
 * @param {boolean} copy - Copy mode to manage memory usage
 * @return {TRaster} - Filtered Image
 *
 * @author TODO
 */
const gaussBlur = (kernel) => (img,copy=true) => {
  let ouput =  TRaster.from(img,copy);
  // TODO
  return output;
}
