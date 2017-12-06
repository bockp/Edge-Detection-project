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
 * Class for Volume
 *
 * @alias T.Volume
 */
 
export default class Volume {
  /**
   * Create an empty Volume
   *
   * @param {string} type - Pixel type number: uint8, uint16, float32, rgba
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {number} depth - Depth
   */
  constructor(type,width,height,depth,pattern="black") {
    
    /**
     * Width
     */
    this.width = width;
    
    /**
     * Height
     */
    this.height = height;
    
    /**
     * Depth
     */
    this.depth = depth;
    
    /**
     * Length = width * height * depth
     */
    this.length = this.width * this.height * this.depth;
    
    /**
     * Type: uint8, uint16, uint32, float32,rgba
     */
    this.type = type;

    /**
     * Metadata containing annotations, information,etc.
     */
    this.metadata = {
      dimension : 3,
      type: type,
      width : width,
      height : height,
      depth : 1,
      fill : pattern
    };
    
    /**
     * Raster containing the pixels
     */
    this.raster = new T.Raster(type,width,height,depth); 
    this.raster.parent = this;
    this.raster.pixelData = T.Raster.createPixels(this.type,this.length);
  }
  
}
