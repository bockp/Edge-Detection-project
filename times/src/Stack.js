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
 * @namespace T
 */
 
 
/**
 * Class for Stack
 *
 * @alias T.Stack
 */

export default class Stack {
  /**
   * Create an empty Stack
   * @param {string} type - Pixel type number: uint8, uint16, float32, rgba
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {number} nslices - Slice number in the stack
   */
  constructor(type,width,height,nslices,pattern="black") {
    
    /**
     * Width
     */
    this.width = width;
    
    /**
     * Height
     */
    this.height = height;
    
    /**
     * Type: uint8, uint16, uint32, float32,rgba
     */
    this.type = type;
    
    /**
     * Pixels array
     */
    this.pixelData; 
    
    /**
     * Slice number
     */
    this.nslices = nslices;
    
    /**
     * Length = width * height * nslices
     */
    this.length = this.width * this.height * this.nslices;

    /**
     * Metadata containing annotations, information,etc.
     */
    this.metadata = {
      dimension : 2.5,
      title : title,
      type: type,
      width : width,
      height : height,
      nslices : nslices,
      fill : pattern,
    };
    
    /**
     * Array of slices Raster
     */
    this.slices = Array.from({length: nslices}, (x,i) => new T.Raster(type,width,height,i.toString()));
  }

  /**
   * Set pixels
   * 
   * @alias T.Stack~setPixels
   * @author Jean-Christophe Taveau
   */
  setPixels(data) {
    this.slices.forEach( (sli,i) => sli.pixelData = data.slice(i*sli.length, i*sli.length + sli.length) );
  }


  /**
   * Execute function for each slice in this stack
   *
   * @param {function} func - Function run for each slice of the stack
   *
   * @author Jean-Christophe Taveau
   */
  forEach(func) {
    this.slices.forEach( (x,i) => func(x,false));
  }
  
  /**
   * Execute function for each slice in this stack
   *
   * @param {function} func - Function run for each slice of the stack
   * @return {array} - returns an array of objects
   *
   * @author Jean-Christophe Taveau
   */
  map(func) {
    return this.slices.map( (x,i) => func(x,true));
  }
  
  /**
   * Extract one slice at given index 
   *
   * @param {number} index - Slice index must be comprised between 0 and length - 1
   * @return {TRaster} 
   * @author Jean-Christophe Taveau
   */
   slice(index) {
    return this.slices[index];
   }
}

