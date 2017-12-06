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
 * @module view
 */
 
/**
 * Rectangular view of a single image 
 *
 * @param {number} x - X-coord of the top-left corner of the rectangle
 * @param {number} y - Y-coord of the top-left corner of the rectangle
 * @param {number} w - Width of the rectangle. A value of -1 corresponds to the input width.
 * @param {number} h - Height rectangle.  A value of -1 corresponds to the input height.
 * @param {TRaster} img - Input Image
 * @param {boolean} copy - Copy mode to manage memory usage. Useless, here just for compatibility. 
 * @returns {TView} Returns a view for rendering
 *
 * @author Jean-Christophe Taveau 
 */
const view = (raster,copy_mode=true) => {
  // Update raster in parent (Image, Stack or Volume?))
  raster.parent.setRaster(raster);
  raster.parent.width = raster.width;
  raster.parent.height = raster.height;
  raster.parent.type = raster.type;
  // HACK let img = new T.Image('view',raster.type,raster.width, raster.height);
  let a_view = new T.View('view',raster.type,raster.width, raster.height);
  a_view.appendLayer({type: 'image', data: raster.parent});
  return a_view;
};

/**
 * Montage - Convert a stack in a view for rendering
 *
 * @param {number} row - Row number
 * @param {number} column - Column number
 * @param {number} scale - Scaling of the resulting image
 * @param {number} border - Border
 * @param {TStack} stack - Input Stack
 * @param {boolean} copy - Copy mode to manage memory usage. Useless, here just for compatibility. 
 * @returns {TView} Returns a view for rendering
 *
 * @author Jean-Christophe Taveau
 */
const montage = (row,column,scale=1.0,border=0) => (stack,copy_mode=true) => {
  let view = new T.View('montage',stack.type,stack.width * column, stack.height * row);
  // Create Image
  let output = new T.Image(stack.type,stack.width * column, stack.height * row);
  stack.slices.forEach( (sli,index) => output.raster.pad( (index % column) * stack.width, Math.floor(index/ column) * stack.height,sli) );
  view.appendLayer({type: 'image',data: output});
  // Create Labels
  let labels = [{type: 'text',x:0,y:0,content: 'Test'}];
  view.appendLayer({type: 'graphics',data: labels});
  return view;
};


// Exports
export {montage,view};
