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

export default class View {
  constructor(title,type,width,height) {
    /**
     * Title
     */
    this.title = title;
    
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
     * Type: uint8, uint16, uint32, float32,rgba
     */
    this.type = type;

    /**
     * Array of Layers
     */
    this.layers = [];
  }
  
  appendLayer(a_layer) {
    this.layers.push(a_layer);
  }
  
  render(win) {
    console.log('render');
    for (let layer of this.layers) {
      switch (layer.type) {
      case '3D':
        render3D(win)(layer.data);
        break;
      case 'graphics':
        T.renderVector(win)(layer.data);
        break;
      case 'image':
        T.render2D(win)(layer.data);
        break;
      case 'table':
        T.renderTable(win)(layer.data);
        break;
      }
    }
  }
}
