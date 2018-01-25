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
 * This program is distributed in the hope that it will be useful,
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

/**
 * https://www.khronos.org/opengl/wiki/Blending
 *
 * @example
 *
 * 
 * @author Jean-Christophe Taveau
 */
const blend = (funcRGBA) => {
  // TODO
  const parse = (txt) => {
    // Get Arguments
    // parse body
    // equations: add(s+d), subtract(s-d) reverse_subtract(d-s) ,min(s,d) max(s,d)
    //factors: constants (0 and 1), alpha, src, dst, constant_color via blendColor?, constant_alpha?
    // get Blend values
  };
  
  // func(src,dst) => src + dst - blendEquation(FUNC_ADD); blendFunc(ONE,ONE))
  // func(src,dst) => src - dst - blendEquation(FUNC_SUBTRACT); blendFunc(ONE,ONE))
  // func(src,dst) => dst - src - blendEquation(FUNC_REVERSE_SUBTRACT); blendFunc(ONE,ONE))
  // func(src,dst) => src * dst [+ 0 * dst]  - blendEquation(FUNC_ADD); blendFunc(DST_COLOR,ZERO))
  // func(src,dst) => src * src.a + (1 - src.a) * dst]  - blendEquation(FUNC_ADD); blendFunc(SRC_ALPHA,ONE_MINUS_SRC_ALPHA))

  // Parse one-liner function
  parse(funcRGBA.toString());
  
  return {
    name: 'blend',
    params: [gpu.FUNC_ADD,gpu.ONE,gpu.ONE]
  }
}

/**
 *
 * @author Jean-Christophe Taveau
 */
const viewport = (x,y,w,h) => ({name: 'viewport', params: [x,y,w,h]});


export {blend,viewport};


