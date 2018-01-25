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

// From MDN
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants

/**
 * Passed to drawElements or drawArrays to draw single points.
 */
export const POINTS  = 0x0000; 
 
/**
 * Passed to drawElements or drawArrays to draw lines. Each vertex connects to the one after it.
 */
export const LINES  = 0x0001;

/**
 * Passed to drawElements or drawArrays to draw lines. Each set of two vertices is treated as a separate line segment.
 */
export const LINE_LOOP = 0x0002;

/**
 * Passed to drawElements or drawArrays to draw a connected group of line segments from the first vertex to the last.
 */
export const LINE_STRIP = 0x0003; 

/**
 * Passed to drawElements or drawArrays to draw triangles. Each set of three vertices creates a separate triangle.
 */
export const TRIANGLES = 0x0004;

/**
 * Passed to drawElements or drawArrays to draw a connected group of triangles.
 */
export const TRIANGLE_STRIP = 0x0005;

/**
 * 	Passed to drawElements or drawArrays to draw a connected group of triangles. 
 * Each vertex connects to the previous and the first vertex in the fan.
 */
export const TRIANGLE_FAN  = 0x0006;

/**
 * Texture constant
 */
export const NEAREST = 0x2600;

/**
 * Texture constant
 */
export const LINEAR = 0x2601;

/**
 * Texture constant
 */
export const REPEAT = 0x2901;

/**
 * Texture constant
 */
export const CLAMP_TO_EDGE = 0x812F;

/**
 * Texture constant
 */
export const MIRRORED_REPEAT = 0x8370;

/**
 * Shorter non official texture constant
 */
export const CLAMP = CLAMP_TO_EDGE;

/**
 * Shorter non official texture constant
 */
export const MIRROR = MIRRORED_REPEAT;

/**
 * Passed to blendEquation or blendEquationSeparate to set an addition blend function. 
 * Op = source + destination,
 */
export const FUNC_ADD = 0x8006;

/**
 * Passed to blendEquation or blendEquationSeparate to specify a subtraction blend function
 * Op = (source - destination).
 */
export const FUNC_SUBSTRACT = 0x800A;

/**
 * Passed to blendEquation or blendEquationSeparate to specify a reverse subtraction blend function 
 * Op =(destination - source).
 */
export const FUNC_REVERSE_SUBTRACT = 0x800B;

/**
 * Produces the minimum color components of the source and destination colors.
 */
export const MIN = 0x8007;

/**
 * Produces the maximum color components of the source and destination colors.
 */
export const MAX = 0x8008;

/**
 * Passed to blendFunc or blendFuncSeparate to turn off a component.
 */
export const ZERO = 0;

/**
 * Passed to blendFunc or blendFuncSeparate to turn on a component.
 */
export const ONE = 1;

/**
 * Passed to blendFunc or blendFuncSeparate to multiply a component by the source elements color.
 */
export const SRC_COLOR = 0x0300;

/**
 * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source elements color.
 */
export const ONE_MINUS_SRC_COLOR = 0x0301;

/**
 * Passed to blendFunc or blendFuncSeparate to multiply a component by the source's alpha.
 */
export const SRC_ALPHA = 0x0302;

/**
 * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source's alpha.
 */
export const ONE_MINUS_SRC_ALPHA = 0x0303;

/**
 * Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's alpha.
 */
export const DST_ALPHA = 0x0304;

/**
 * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's alpha.
 */
export const ONE_MINUS_DST_ALPHA = 0x0305;

/**
 * Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's color.
 */
export const DST_COLOR = 0x0306;

/**
 * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's color.
 */
export const ONE_MINUS_DST_COLOR = 0x0307;

/**
 * Passed to blendFunc or blendFuncSeparate to multiply a component by the minimum of source's alpha or one minus the destination's alpha.
 */
export const SRC_ALPHA_SATURATE = 0x0308

/**
 * Passed to blendFunc or blendFuncSeparate to specify a constant color blend function.
 */
export const CONSTANT_COLOR = 0x8001;

/**
 * Passed to blendFunc or blendFuncSeparate to specify one minus a constant color blend function.
 */
export const ONE_MINUS_CONSTANT_COLOR = 0x8002;

/**
 * Passed to blendFunc or blendFuncSeparate to specify a constant alpha blend function.
 */
export const CONSTANT_ALPHA = 0x8003;

/**
 * Passed to blendFunc or blendFuncSeparate to specify one minus a constant alpha blend function.
 */
export const ONE_MINUS_CONSTANT_ALPHA = 0x8004;


