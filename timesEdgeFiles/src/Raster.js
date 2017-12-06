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
 * Class for Raster
 *
 * @alias T.Raster
 */
 
export default class Raster {
  /**
   * Create an empty TRaster.
   * 
   * @param {string} type - One of these: uint8, uint16, float32, rgba
   * @param {number} width - Image Width
   * @param {number} height - Image Height
   * @param {number} offset - Offset
   */
  constructor(type,width,height,depth=1) {
    /**
     * Width
     */
    this.width = width;
    
    /**
     * Height
     */
    this.height = height;
    
    /**
     * Depth Only for 3D data
     */
    this.depth = depth;
    
    /**
     * Label
     */
    this.label = 'None';
    
    /**
     * Length = width * height
     */
    this.length = this.width * this.height * this.depth;
    
    /**
     * Type: uint8, uint16, uint32, float32,rgba
     */
    this.type = type;
    
    /**
     * Pixels array
     */
    this.pixelData; 
    
    /**
     * Image, Stack or Volume parent
     */
    this.parent; 
  }
  
  /*
   * Create the Pixels Array filled in black (value = 0)
   *
   * @alias T.Raster.createPixels
   * @param {string} type - uint8, uint16, uint32, float32,rgba
   */
  static createPixels(type,length) {
    let arr;
    switch (type) {
    case 'uint8': arr = new Uint8ClampedArray(length).fill(0); break;
    case 'uint16': arr = new Uint16Array(length).fill(0);break;
    case 'uint32': arr = new Uint32Array(length).fill(0);break;
    case 'float32': arr = new Float32Array(length).fill(0.0);break;
    case 'abgr':
    case 'rgba': arr = new Uint32Array(length).fill(0);break;
    }
    return arr;
  }
  
  static MIN_VALUE() {
    return 0;
  }
  
  static fromWindow(win, copy = true) {
    let img = new TRaster(win.metadata.type,win.metadata.width,win.metadata.height);
    img.pixelData (copy === true) ? [...win.raster.pixelData] : win.raster.pixelData; // Copy pixels
    img.setWindow(win);
    return img;
  }
  
  /**
   * Create a new Raster from another Raster
   *
   * @alias T.Raster.from
   * @param {TRaster} other - uint8, uint16, uint32, float32,rgba
   */
  static from(other, copy = true) {
    let img = new T.Raster(other.type,other.width, other.height);
    img.parent = other.parent;
    img.pixelData = (copy === true) ? [...other.pixelData] : other.pixelData; // Copy pixels
    return img;
  }
  
  fill(value) {
    this.pixelData.fill(value);
  }
  
    
  /**
   * compose(func1, func2, func3, ..., funcn)
   * From https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
   *
   * @alias T.Raster.compose
   * @example compose(func1,func2) returns func1(func2(x))
   *
   * @author Eric Elliott
   */
  compose (...fns) {
    return fns.reduceRight((v, f) => f(v,false), this);
  }

  /**
   * pipe(func1, func2, func3, ..., funcn)
   * From https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d
   *
   * @example pipe(func1,func2) returns func2(func1(x))
   *
   * @author Eric Elliott
   */
  pipe (...fns) {
    return fns.reduce((v, f) => f(v,false), this);
  }
  
  /**
   * Get pixel value at given index
   *
   * @alias T.Raster~get
   * @param {number} index - Index
   * @returns {number}  Pixel Value
   *
   * @author: Jean-Christophe Taveau
   */
  get(index) {
    return this.pixelData[index];
  }
  
  /**
   * Get pixel value at given X,Y-coordinates
   *
   * @alias T.Raster~getPixel
   * @param {number} x - X-coordinate
   * @param {number} y - Y-coordinate
   * @returns {number}  Pixel Value
   *
   * @author: Jean-Christophe Taveau
   */
  getPixel(x,y) {
    let index = x + y * this.width;
    return this.pixelData[index];
  }
  
  /**
   * Get X,Y-coordinate from index
   *
   * @alias T.Raster~xy
   * @param {number} index - Index
   * @returns {array}  X- and Y-coordinates
   *
   * @author: Jean-Christophe Taveau
   */
  xy(index) {
    return [this.x(index), this.y(index)];
  }
  
  /**
   * Get X-coordinate from index
   *
   * @alias T.Raster~x
   * @param {number} index - Index
   * @returns {number}  X-coordinate
   *
   * @author: Jean-Christophe Taveau
   */
  x(index) {
    return index % this.width;
  }
  
  /**
   * Get Y-coordinate from index
   *
   * @alias T.Raster~y
   * @param {number} index - Index
   * @returns {number}  Y-coordinate
   *
   * @author: Jean-Christophe Taveau
   */
  y(index) {
    return Math.floor(index / this.width);
  }
  
  /**
   * Set pixel value at given index
   *
   * @param {number} index - Pixel index
   * @param {number} value - Pixel value
   * @author Jean-Christophe Taveau
   */
  set(index,value) {
    this.pixelData[index] = value;
  }

  /**
   * Set pixel value at given X,Y-coordinates
   *
   * @param {number} x - Pixel X-coordinate
   * @param {number} y - Pixel Y-coordinate
   * @param {number} value - Pixel value
   * @author Jean-Christophe Taveau
   */
  setPixel(x,y,value) {
    this.pixelData[x + y * this.width] = value;
  }

  /**
   * Pad a smaller raster within this raster
   *
   * @author Jean-Christophe Taveau
   */
  pad(topleft_x,topleft_y,small_img) {
    for (let y = 0; y < small_img.height; y++) {
      let chunk = small_img.pixelData.slice(y * small_img.width, (y+1) * small_img.width);
      chunk.forEach ( (px, index) => this.pixelData[topleft_x + index + (topleft_y + y)* this.width] = px, this);
    }
  }
}
