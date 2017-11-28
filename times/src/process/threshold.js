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
 * Manual thresholding
 *
 * @param {number} value - Threshold value
 * @param {TRaster} img - Input gray-level image
 * @param {boolean} copy_mode - Boolean used to control the deep copy or not of the pixels data
 * @return {TRaster} - Binary output image with True = 0 (black) and False = 255 (white) pixels
 *
 * @author Jean-Christophe Taveau
 */
const threshold = (value) => (img,copy_mode = true) => {
  let output = TRaster.from(img,copy_mode);
  output.pixelData.forEach(px =>(px > value) ? 0 : 255);
  return output;
};

/**
 * <Description>
 *
 * @param {type} <name> - <Description>
 * @return {type} - <Description>
 * @author TODO
 */
const otsu = function (img,copy=true) {
  // TODO
  console.log(`otsu`);
  return TRaster.from(img,copy);
}
