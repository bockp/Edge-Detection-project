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

/**
 * Class for Image
 *
 * @alias T.Image
 */
 
export default class Image {
  /**
   * Create an empty Image.
   * 
   * @param {string} type - One of these: uint8, uint16, float32, rgba
   * @param {number} width - Image Width
   * @param {number} height - Image Height
   * @param {number} offset - Offset
   */
  constructor(type,width,height, pattern="black") {
    
    /**
     * Width
     */
    this.width = width;
    
    /**
     * Height
     */
    this.height = height;
    
    
    /**
     * Length = width * height
     */
    this.length = this.width * this.height;
    
    /**
     * Type: uint8, uint16, uint32, float32,abgr, rgba
     */
    this.type = type;

    /**
     * Metadata containing annotations, information,etc.
     */
    this.metadata = {
      dimension : 2,
      type: type,
      width : width,
      height : height,
      depth : 1,
      fill : pattern
    };
    
    /**
     * Raster containing the pixels
     */
    this.raster = new T.Raster(type,width,height); 
    this.raster.parent = this;
    this.fillPattern(pattern);
  }
  
  
  fillPattern(pattern) {
    let raster = this.raster;
    if (raster.pixelData === undefined) {
      raster.pixelData = T.Raster.createPixels(this.type,this.length);
      console.log(`Create pixels of ${this.type}`);
    }
    if (pattern.toLowerCase() === 'black') {
      raster.pixelData.fill(T.Raster.MIN_VALUE(this.type));
    }
    else if (pattern.toLowerCase() === 'white') {
      raster.pixelData.fill(T.Raster.MAX_VALUE(this.type));
    }
    else if (pattern.toLowerCase() === 'ramp') {
      raster.pixelData.map(x => T.Raster.MAX_VALUE()/ this.width * (i % this.width));
    }
  }
  

  /**
   * Get raster
   *
   * @alias T.Image~getRaster
   * @return {Raster} Returns the raster
   *
   * @author Jean-Christophe Taveau
   */
  getRaster() {
    return this.raster;
  }

  /**
   * Set raster
   *
   * @alias T.Image~setRaster
   * @param {Raster} a_raster - A raster image
   *
   * @author Jean-Christophe Taveau
   */
  setRaster(a_raster) {
    this.raster = a_raster;
  }

  /**
   * Set pixels
   *
   * @alias T.Image~setPixels
   * @param {array} data - Array of pixel values (numbers)
   * @author Jean-Christophe Taveau
   */
  setPixels(data) {
    this.raster.pixelData = data;
  }
  
  setWindow(win) {
    this.window = win;
  }

}
