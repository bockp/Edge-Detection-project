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
 


import {TIMES} from './TIMES';

import Raster from './Raster';
import Image from './Image';
import Stack from './Stack';
import Volume from './Volume';
import Window from './Window';
import View from './View';

/* io/loadImage */
import {loadImage} from './io/loadImage';

/* Process/utils */
import {clamp,clampUint8,pipe} from './process/utils';

/* Process/color */
import {red,blue,green,alpha,luminance, chrominanceRed, chrominanceBlue,hue, saturation, value,splitChannels,toRGBA} from './process/color';

/* Process/geometry */
import {crop} from './process/geometry';

/* Process/math */
import {black,calc,chessboard,fillColor,fill,math,ramp,spiral,white} from './process/math';

/* Process/noise */
import {noise,saltAndPepper} from './process/noise';

//* Process/statistics */
import {histogram,statistics} from './process/statistics';

//* Process/type */
import {fromABGRtoUint8} from './process/type';

/* Render/view */
import {montage,view} from './render/view';

/* Render */
import {renderUint8,renderUint16,renderFloat32,renderABGR,renderRGBA,render2D} from './render/render2D';
import {renderVector} from './render/renderVector';

export {
  Raster,Image,Stack,Volume,Window,View,
  loadImage,
  clamp,clampUint8,pipe,
  red,blue,green,alpha,luminance, chrominanceRed, chrominanceBlue, hue, saturation, value,
  splitChannels,toRGBA,
  crop,
  black,calc,chessboard,fillColor,fill,math,ramp,spiral,white,
  noise,saltAndPepper,
  histogram,statistics,
  fromABGRtoUint8,
  montage,view,
  renderUint8,renderUint16,renderFloat32,renderABGR,renderRGBA,render2D,
  renderVector
};


