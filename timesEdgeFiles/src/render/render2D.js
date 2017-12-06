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

'use strict';

import {isLittleEndian} from '../process/utils';

/**
 * Functions used to render image in a HTML5 web page
 * @module render2D
 */
 
/**
 * Display uint8 image
 *
 * @param {TWindow} win - Window used to display the image in the HTML5 page
 * @param {TImage} uint8 - Image containing uint8 pixels data
 * @param {boolean} copy - Useless. Just here for compatibility with other process/render functions.
 *
 * @author Jean-Christophe Taveau
 */
const renderUint8 = (win) => (img8bit,copy=true) => {
  // Tutorial: https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
  let imgdata = win.ctx.createImageData(img8bit.width, img8bit.height);

  // New RGBA image buffer
  let buf = new ArrayBuffer(img8bit.width * img8bit.height * 4);
  let buf32 = new Uint32Array(buf);
  let buf8 = new Uint8Array(buf);
  // Fill with ABGR color values
  buf32.forEach( (px,i,arr) => arr[i] = T.toRGBA(img8bit.pixelData[i],img8bit.pixelData[i],img8bit.pixelData[i],255) );

  imgdata.data.set(buf8);
  win.ctx.putImageData(imgdata, 0, 0);
};


/**
 * Display uint16 image
 *
 * @param {TWindow} win - Window used to display the image in the HTML5 page
 * @param {TImage} uint8 - Image containing uint8 pixels data
 * @param {boolean} copy - Useless. Just here for compatibility with other process/render functions.
 *
 * @author Jean-Christophe Taveau
 */
const renderUint16 = (win) => (img16bit,copy=true) => {
  // Tutorial: https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
  let imgdata = win.ctx.createImageData(img16bit.width, img16bit.height);

  // New RGBA image buffer
  let buf = new ArrayBuffer(img16bit.width * img16bit.height * 4);
  let buf32 = new Uint32Array(buf);
  let buf8 = new Uint8Array(buf);
  // Fill with ABGR color values
  buf32.forEach( (px,i,arr) => arr[i] = T.toRGBA(img16bit.pixelData[i] >> 8,img16bit.pixelData[i] >> 8,img16bit.pixelData[i] >> 8,255) );

  imgdata.data.set(buf8);
  win.ctx.putImageData(imgdata, 0, 0);
};


/**
 * Display float32 image
 *
 * @param {TWindow} win - Window used to display the image in the HTML5 page
 * @param {TImage} uint8 - Image containing uint8 pixels data
 * @param {boolean} copy - Useless. Just here for compatibility with other process/render functions.
 *
 * @author Jean-Christophe Taveau
 */
const renderFloat32 = (win) => (imgf32,copy=true) => {
  // Tutorial: https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
  let imgdata = win.ctx.createImageData(imgf32.width, imgf32.height);
  
  // Update statistics
  let dummy = T.statistics(imgf32); 
  
  // New RGBA image buffer
  let buf = new ArrayBuffer(imgf32.length * 4);
  let buf32 = new Uint32Array(buf);
  let buf8 = new Uint8Array(buf);
  // Fill with ABGR color values
  let delta = 255.0 / (imgf32.statistics.max - imgf32.statistics.min) ;
  buf32.forEach( (px,i,arr) => {
    let pix = Math.floor((imgf32.pixelData[i] - imgf32.statistics.min) * delta );
    arr[i] = T.toRGBA(pix,pix,pix,255);
  });

  imgdata.data.set(buf8);
  win.ctx.putImageData(imgdata, 0, 0);
};


/**
 * Display RGBA image
 *
 * @param {TWindow} win - Window used to display the image in the HTML5 page
 * @param {TImage} img - Image containing RGBA pixels data
 * @param {boolean} copy - Useless. Just here for compatibility with other process/render functions.
 *
 * @author Jean-Christophe Taveau
 */
const renderRGBA = (win) => (img,copy=true) => {
  // Tutorial: https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
  let imgdata = win.ctx.createImageData(img.width, img.height);

  // New RGBA image buffer
  let buf = new ArrayBuffer(img.width * img.height * 4);
  let buf32 = new Uint32Array(buf);
  let buf8 = new Uint8Array(buf);
  // Fill with ABGR color values
  buf32.forEach( (px,i,arr) => arr[i] = img.pixelData[i]);
  // T.toRGBA(T.red(img.pixelData[i]),T.green(img.pixelData[i]),T.blue(img.pixelData[i]),T.alpha(img.pixelData[i]) ) );

  imgdata.data.set(buf8);
  win.ctx.putImageData(imgdata, 0, 0);
};


const render2D = (win) => (img,copy=true) => {
  console.log(win);
  switch (img.raster.type) {
  case 'uint8':
    T.renderUint8(win)(img.raster);
    break;
  case 'uint16':
    T.renderUint16(win)(img.raster);
    break;
  case 'float32':
    T.renderFloat32(win)(img.raster);
    break;
  case 'rgba':
  case 'abgr':
    renderRGBA(win)(img.raster);
    // (isLittleEndian()) ? T.renderABGR(win)(img.raster) : T.renderRGBA(win)(img.raster);
    break;
  }
};

// Exports
export {renderUint8,renderUint16,renderFloat32,renderABGR,renderRGBA,render2D}; 

