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
 
'use script';

import {clamp,isLittleEndian} from './utils';

/**
 * @module color
 */
 

/*
 * Clamp value between 0 and 255 (2^8 -1)
 *
 * @author Jean-Christophe Taveau
 */
const clampUint8 = clamp(0,255);
 
/**
 * Compute color pixel value from gray uint8 value 
 * @param {number} gray8 - uint8 gray value 
 * @return {number} color Pixel value 
 */
const fromGray8 = (gray8) => isLittleEndian() ? 0xff000000 | gray8 << 16 | gray8 << 8 | gray8 & 0xff : gray8 << 24 | gray8 << 16 | gray8 << 8 | 0xff;

/**
 * Convert color pixel value to an array with red, green, blue, and alpha uint8 values
 * @param {number} color - color Pixel value 
 * @return {array} An array of red, green, blue, and alpha uint8 components
 */
const fromcolor = (color) => [(color >> 24) & 0xff, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff];

const tocolor = (r,g,b,a) => ( r << 24) | (g << 16) | (b << 8) | a;

// TODO
const fromABGR = (abgr) => ( abgr << 24) | (abgr << 16) | (abgr << 8) | abgr;

/**
 * Compute RGBA pixel value from four uint8 red, green, blue, and alpha components 
 * @param {number} red - uint8 red component 
 * @param {number} green - uint8 green component 
 * @param {number} blue - uint8 blue component 
 * @param {number} alpha - uint8 alpha component 
 * @return {number} ABGR Pixel value 
 */
const toRGBA = (r,g,b,a) => (isLittleEndian() ? (( a << 24) | (b << 16) | (g << 8) | r) : (( r << 24) | (g << 16) | b << 8) | a);

// TODO
const toabgr = (color) => ( (color & 0xff) << 24) | ( (color & 0x00ff00) << 8) | ( (color & 0xff0000) >> 8) | ( (color & 0xff000000) >> 24);

/**
 * Extract red component of color pixel value
 * @param {number} color - color Pixel value 
 * @return {number} uint8 value 
 */
const alpha = (color) => isLittleEndian() ? color >> 24 & 0xff : color & 0xff;

/**
 * Extract green component of color pixel value
 * @param {number} color - color Pixel value 
 * @return {number} uint8 value 
 */
const blue = (color) => isLittleEndian() ? color >> 16 & 0xff : color >> 8 & 0xff;

/**
 * Extract blue component of color pixel value
 * @param {number} color - color Pixel value 
 * @return {number} uint8 value 
 */
const green = (color) => isLittleEndian() ? color >> 8 & 0xff : color >> 16 & 0xff;

/**
 * Extract alpha (transparency) component of color pixel value
 * @param {number} color - color Pixel value 
 * @return {number} - uint8 value 
 */
const red = (color) => isLittleEndian() ? color & 0xff : color >> 24 & 0xff;

/**
 * Compute Luminance gray value from color pixel value
 * @param {number} color - color Pixel value 
 * @return {number} Luminance uint8 value 
 */
const luminance = (color) => {
  /*
  Franci Penov and Glenn Slayden
  From https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
  Photometric/digital ITU BT.709: Y = 0.2126 R + 0.7152 G + 0.0722 B
  Digital ITU BT.601 (gives more weight to the R and B components): Y = 0.299 R + 0.587 G + 0.114 B
  Approximation #1: Y = 0.33 R + 0.5 G + 0.16 B
  Approximation #2: Y = 0.375 R + 0.5 G + 0.125 B
  Fast: Y = (R+R+B+G+G+G)/6
  Fast: Y = (R+R+R+B+G+G+G+G)>>3
  */
  
  let r = red(color);
  let g = green(color);
  let b = blue(color);
  return (r+r+r+b+g+g+g+g)>>3; 
};

/**
 * Extract chrominance red component of color pixel value according to the YUV colorspace
 * @param {number} color - Color Pixel value 
 * @return {number} - uint8 value 
 */
const chrominanceRed = (color) => -0.168736 * red(color) - 0.331264 * green(color) + 0.500000 * blue(color) + 128;

/**
 * Extract chrominance blue component of color pixel value according to the YUV colorspace
 * @param {number} color - color Pixel value 
 * @return {number} - uint8 value 
 */
const chrominanceBlue = (color) => 0.500000 * red(color) - 0.418688 * green(color) - 0.081312 * blue(color) + 128;

/**
 * Convert color pixel value to Average gray value
 * @param {number} color - color Pixel value 
 * @return {number} uint8 value
 */
const average = (color) => Math.floor(red(color) + green(color) + blue(color) / 3.0);

/**
 * Extract hue component of color pixel value according to HSV colorspace
 * @param {number} color - color Pixel value 
 * @return {number} - uint8 value 
 */
const hue = (color) => {
  const ratio = (a,b,delta) => (a-b)/delta;
  
  let r = T.red(color) / 255.0, g = T.green(color) / 255.0, b = T.blue(color) / 255.0;
  let maxi = Math.max(r,Math.max(g,b));
  let mini = Math.min(r,Math.min(g,b));
  let delta = maxi - mini;
  let out = (maxi === 0 || mini === maxi) ? 0 :
    ( (maxi === r) ? (60 * ratio(g,b,delta) + 0) % 360 : 
      ( (maxi === g) ? 60 * ratio(b,r,delta) + 120 : 60 * ratio(r,g,delta) + 240 ) ); 
  return clampUint8(Math.floor(out / 360.0 * 255));
};

const hue2 = (color) => {
  let r = T.red(color), g = T.green(color), b = T.blue(color);
  let maxi = Math.max(r,Math.max(g,b));
  let mini = Math.min(r,Math.min(g,b));

  if (maxi === 0 || maxi === mini) {
    return 0;
  }
  
  if (maxi === r) {
    return  Math.max(0,Math.min(Math.floor(0 + 43 * (g - b) / (maxi - mini),255)));
  }
  else if (maxi === g) {
    return Math.max(0,Math.min(85 + 43 * (b - r) / (maxi - mini)));
  }
  else {
    return Math.max(0,Math.min(171 + 43 * (r - g) / (maxi - mini)));
  }
}

/**
 * Extract saturation component of color pixel value  according to HSV colorspace
 * @param {number} color - color Pixel value 
 * @return {number} - uint8 value 
 */
const saturation = (color) => {
  let r = T.red(color), b = T.blue(color), g = T.green(color);
  let maxi = Math.max(r,Math.max(g,b));
  let mini = Math.min(r,Math.min(g,b));
  return (maxi === 0) ? 0 : (1.0 - mini/maxi) * 255;
};

/**
 * Extract `value` component of color pixel value according to HSV colorspace
 * @param {number} color - color Pixel value 
 * @return {number} - uint8 value 
 */
const value = (color) => Math.max(T.red(color),Math.max(T.green(color), T.blue(color)));


/**
 * Split channels of color Raster according to various colorspaces
 *
 * @param {function} fns - A series of functions among:
 * <ul>
 * <li> red(px), green(px),blue(px),alpha(px),</li>
 * <li> hue(px),saturation(px),value(px),</li>
 * <li> cyan(px),magenta(px),yellow(px),</li>
 * <li> luminance(px), chrominance(px)</li>
 * </ul>
 * @param {Raster} color_img - A color image
 * @param {boolean} copy - Useless here, only for compatibility with the other process functions
 * @return {Stack} Return a stack containing the channels of various colorspaces
 * @see color.js
 */
const splitChannels = (...fns) => (color_img,copy = true) => {
  let stack = new T.Stack("Split Channels","uint8",color_img.width,color_img.height,fns.length);
  stack.slices.forEach( (sli) => sli.pixelData = T.Raster.createPixels('uint8',color_img.length) );
  stack.slices.forEach( (sli,i) => {
    sli.label = fns[i].name;
    sli.pixelData.forEach( (px,j,pixels) => pixels[j] = fns[i](color_img.pixelData[j]));
  });
  return stack;
};


// Exports
export {red, green, blue, alpha, luminance, chrominanceRed, chrominanceBlue, average, hue, saturation, value}; 
export {toRGBA,tocolor}; 
export {splitChannels}; 

