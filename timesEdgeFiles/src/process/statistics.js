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
 * @module statistics
 */
 
/**
 * Computes basic stats: min, max, mean/average and standard deviation of the image.
 * Algorithm for variance found in <a href="https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance#Two-pass_algorithm">Wikipedia</a>
 * 
 * @param {Raster} img - Input raster
 * @param {boolean} copy_mode - Useless here, only for compatibility with the other processing functions
 * @return {object} - Returns an object containing min, max, mean, variance
 *
 * @author Jean-Christophe Taveau
 */
const statistics = (img, copy_mode = true) => {
  let tmp = img.pixelData.reduce ( (accu,px,i) => {
    accu.min = Math.min(accu.min,px);
    accu.max = Math.max(accu.max,px);
    accu.mean += px;
    accu.n++;
    let delta = px - accu.mean2;
    accu.mean2 += delta/accu.n;
    accu.variance += delta * delta;
    return accu;
  },
  {min: Number.MAX_SAFE_INTEGER, max: 0, mean: 0.0, mean2 : 0.0, n: 0, variance: 0.0}
  );

  // Update stats in this TRaster
  img.statistics = {
    min: tmp.min,
    max: tmp.max,
    count : img.pixelData.length,
    mean : tmp.mean / img.pixelData.length,
    stddev : Math.sqrt(tmp.variance / img.pixelData.length)
  };
  return img;
};

const histogram = (binNumber) => (raster, copy_mode = true) => {
  // Update statistics
  let stats = T.statistics(raster);
  let delta = (raster.statistics.max - raster.statistics.min);
  raster.statistics.histogram = raster.pixelData.reduce ((bins,px,i) => {
    let index = T.clamp(0,binNumber)( Math.floor( (binNumber - 1) * (px - raster.statistics.min)/ delta));
    bins[index]++;
    return bins;
    },
    new Array(binNumber).fill(0)
  );
  return raster;
};

// Exports
export {histogram,statistics};


