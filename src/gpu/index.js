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
 

/* gpu/gpu_constants */
import {
  POINTS,LINES,LINE_LOOP,LINE_STRIP,TRIANGLES,TRIANGLE_STRIP,TRIANGLE_FAN,
  NEAREST,LINEAR,REPEAT,CLAMP_TO_EDGE,MIRRORED_REPEAT,CLAMP,MIRROR,
  FUNC_ADD,FUNC_SUBSTRACT,FUNC_REVERSE_SUBTRACT,MIN,MAX,
  ZERO,ONE,SRC_COLOR,ONE_MINUS_SRC_COLOR,SRC_ALPHA,ONE_MINUS_SRC_ALPHA,
  DST_ALPHA,ONE_MINUS_DST_ALPHA,DST_COLOR,ONE_MINUS_DST_COLOR,
  SRC_ALPHA_SATURATE,CONSTANT_COLOR,ONE_MINUS_CONSTANT_COLOR,CONSTANT_ALPHA,
  ONE_MINUS_CONSTANT_ALPHA} from './gpu_constants';

/* gpu/gpu_utils */
import {createGPU,createProgram,getGraphicsContext,rectangle} from './gpu_utils';

/* gpu/Processor*/
import {Processor} from './Processor';

/* gpu/color*/
import {invert} from './gpu_color';

/* gpu/math*/
import {fill} from './gpu_math';

/* gpu/preprocess*/
import {blend} from './gpu_preprocess';

/* gpu/statistics*/
import {histogram} from './gpu_statistics';


export {
  POINTS,LINES,LINE_LOOP,LINE_STRIP,TRIANGLES,TRIANGLE_STRIP,TRIANGLE_FAN,
  NEAREST,LINEAR,REPEAT,CLAMP_TO_EDGE,MIRRORED_REPEAT,CLAMP,MIRROR,
  FUNC_ADD,FUNC_SUBSTRACT,FUNC_REVERSE_SUBTRACT,MIN,MAX,
  ZERO,ONE,SRC_COLOR,ONE_MINUS_SRC_COLOR,SRC_ALPHA,ONE_MINUS_SRC_ALPHA,
  DST_ALPHA,ONE_MINUS_DST_ALPHA,DST_COLOR,ONE_MINUS_DST_COLOR,
  SRC_ALPHA_SATURATE,CONSTANT_COLOR,ONE_MINUS_CONSTANT_COLOR,CONSTANT_ALPHA,
  ONE_MINUS_CONSTANT_ALPHA,
  createGPU,createProgram,getGraphicsContext,rectangle,
  Processor,
  invert,
  fill,
  blend,viewport,
  histogram
};


