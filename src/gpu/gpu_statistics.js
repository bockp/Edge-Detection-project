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
 * @module statistics
 */
 
/**
 * Computes basic stats: min, max, mean/average and standard deviation of the image.
 * Algorithm for variance found in <a href="https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance#Two-pass_algorithm">Wikipedia</a>
 * 
 * @param {Raster} img - Input raster
 * @param {boolean} copy_mode - Useless here, only for compatibility with the other processing functions
 * @return {object} - Returns an object containing min, max, mean, variance
 *
 * @author Jean-Christophe Taveau
 */
const statistics = (img, copy_mode = true) => {
  // TODO

  return img;
};

const histogram = (binNumber) => (raster, copy_mode = true) => {
  // https://stackoverflow.com/questions/10316708/ios-glsl-is-there-a-way-to-create-an-image-histogram-using-a-glsl-shader
  // https://www.opengl.org/discussion_boards/showthread.php/151073-copying-from-texture-to-vertex-buffer
  // texture to vertex buffer ? see http://nullprogram.com/blog/2014/06/29/
  
  let src_vs_texture = `#version 300 es
  
    in int a_index;

    uniform int maxbin;
    
    // Vertex Texture
    uniform sampler2D u_raster;
    
    out float bin;
    
    void main() {
      ivec2 u_size = textureSize(u_raster,0);
      int x = (a_index % u_size.x);
      int y = int(a_index / u_size.x);
      vec2 coords = vec2(x / u_size.x, y / u_size.y);
      // bin = texture(u_raster, coords) ;

      gl_Position = vec4(coords * 2.0 - 1.0, 0.0, 1.0);
    }
  `;
  // Vertex Shader
  let src_vs = `#version 300 es
  
    in float a_pixel;

    uniform float u_maxbin;
    
    out float bin;
    
    void main() {
      bin = (a_pixel + 0.5) / u_maxbin;
      gl_Position = vec4(bin * 2.0 - 1.0, 0.0, 0.0, 1.0);
    }
  `;
  // Fragment Shader
  let src_fs = `#version 300 es
    precision mediump float;
    
    const vec3 step = vec3(1.0,0.0,0.0);
    
    in float bin;
    out vec4 outColor;
    
    void main(){
      outColor = vec4(step, 1.0) ;
    }`;
  
  // Step #2: Create - compile + link - shader program
  let the_shader = gpu.createProgram(gpuEnv,src_vs,src_fs);
  
  // Step #3: Create the rectangle WITHOUT texture
  let maxBin = binNumber; 
  
  let gproc = gpu.createGPU(gpuEnv,maxBin,1)
    .geometry({
      type: gpu.POINTS,
      num: raster.width * raster.height,
      vertices: new Float32Array(raster.pixelData)
    } )
    .attribute('a_pixel',1,'float', 4,0)
    .packWith(the_shader) 
    .clearCanvas([0.0,0.0,0.0,1.0])
    .redirectTo('fbo','float32')
    .preprocess([
      gpu.blend((src,dst) => src + dst)
    ])
    .uniform('u_maxbin',maxBin)
    .run();
    
  let histogramFloat = gproc.readPixels('fbo').filter( (v,i) => ( (i % 4) === 0)  );
    
  if (raster.statistics === undefined) {
    raster.statistics = {
      min: -1,
      max: -1,
      count : raster.pixelData.length,
      mean : -1,
      stddev : -1,
      histogram: histogramFloat
    };
  }
  else {
    raster.statistics.histogram = histogramFloat;
  }

  return raster;
};

// Exports
export {histogram};


