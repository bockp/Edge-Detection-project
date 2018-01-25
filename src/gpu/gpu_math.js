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

'use strict';


/**
 * @module math
 */
 

  
/**
  * Fill with values calculated from a function
  *
  * @param {function} func - A function
  * <p>The function may take a maximum of nine arguments:</p>
  * <ul>
  * <li>pix - Pixel value</li>
  * <li>index - Index corresponding to pix. A raster is a 1D pixels array</li>
  * <li>x - X-coordinate of pix</li>
  * <li>y - Y-coordinate of pix</li>
  * <li>z - Z-coordinate of pix if raster is in 3D</li>
  * <li>w - Width of raster</li>
  * <li>h - Height of raster</li>
  * <li>a - Angle calculated as atan2(y/x)</li>
  * <li>d - Distance to the center</li>
  * </ul>
  * @example <caption>Fill with a spiral</caption>
  * const DEG = Math.PI / 180;
  * const spiral = (pix,i,x,y,z,w,h,a,d) => 128 * (Math.sin(d / 10+ a * DEG)+1);
  * let raster = T.fill(spiral)(img.getRaster() );
  * @param {Raster} raster - Input Raster
  * @param {boolean} copy_mode - Useless, here. Only for compatibility with other process functions
  *
  * @author Jean-Christophe Taveau
  */
const fill = (func) => (raster,copy_mode=true) => {
  let src_vs = `#version 300 es

  in vec2 a_vertex;
  
  void main() {
    gl_Position = vec4(a_vertex * 2.0 - 1.0, 0.0, 1.0);
  }`;

  /*
    Private function
   */
  function parse(src) {
    
    // Parse
    // 1- Search the arguments between parentheses `(..)`
    let re = /\(([^)]+)\)/g;
    let args = re.exec(src)[1].split(',');
    if (args.length !== 9) {
      const default_args = ['pix','index','x','y','z','rasterWidth','rasterHeight','angle','distance'];
      args = [...args,...default_args.slice(args.length,default_args.length) ];
    }
    // 2- Search the core between curly brackets {..}` or between arrow `=>` and semi-column `;` or EOL
    //=> { }
    let func_body = '';
    if (/\{(.*)\}/g.exec(src) === undefined) {
      func_body = /\{(.*)\}/g.exec(src)[1];
    }
    else {
      func_body = /=>(.*)$/g.exec(src)[1];
    }
    // 2- Clean code like removing `Math.`, changed variable names, etc.
    // Python replace(/(?<![\d.])[0-9]+(?![\d.])/,'$1.0');
    func_body = func_body.replace(/Math\./g,'').replace(/cpu\./g,'').replace(/([\d.]+)/g,'$1.0').replace(/(\.\d+).0/g,'$1');
    
    // Build the code
    let func_code = `vec4 fill(float ${args[0]}) {
        float ${args[2]} = gl_FragCoord.x; 
        float ${args[3]} = gl_FragCoord.y;
        // float ${args[4]} = gl_FragCoord.z;
        float ${args[5]} = u_rasterSize.x;
        float ${args[6]} = u_rasterSize.y;
        int ${args[1]} = int(${args[2]} + ${args[5]} * ${args[3]});
        float halfw = ${args[5]} / 2.0;
        float halfh = ${args[6]} / 2.0;
        vec2 point = vec2((${args[2]} - halfw), (${args[3]} - halfh));
        float ${args[8]} = sqrt( dot(point,point) );
        float ${args[7]} = atan(${args[3]}/${args[2]});
        float value = ${func_body};
        return vec4(vec3(value / 255.0),1.0);
      }`; 
    // 2- if pixel used, define a sampler...

    let template = `#version 300 es
      precision highp float;
      
      // we need to declare an output for the fragment shader
      out vec4 outColor;
      uniform vec2 u_rasterSize;

      ${func_code}
      
      void main() {
        outColor = vec4(fill(0.0)); 
      }`;
    
    // DEBUG - 
    console.log(template);
    
    return template;
  } 
  
  // Step #2: Parse `func` to create fragment source
  let src_fs = parse(func.toString());

  // Step #2: Create - compile + link - shader program
  let the_shader = gpu.createProgram(gpuEnv,src_vs,src_fs);
  
  // Step #3: Create the rectangle WITHOUT texture 
  let gproc = gpu.createGPU(gpuEnv,raster.width,raster.height)
    .geometry({
      type: gpu.TRIANGLE_STRIP,
      num: 4,
      vertices: new Float32Array([
        0.0,0.0,
        0.0,1.0,
        1.0,0.0,
        1.0,1.0,
        ])
    })
    .attribute('a_vertex',2,'float', 2 * 4,0)
    .packWith(the_shader) 
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_rasterSize',new Float32Array([raster.width,raster.height]) )
    .run();
    
  return raster;
};
  

/**
  * Fill with values calculated from a function
  *
  * @param {function} func - A function
  * <p>The function may take a maximum of nine arguments:</p>
  * <ul>
  * <li>pix - Pixel value</li>
  * <li>index - Index corresponding to pix. A raster is a 1D pixels array</li>
  * <li>x - X-coordinate of pix</li>
  * <li>y - Y-coordinate of pix</li>
  * <li>z - Z-coordinate of pix if raster is in 3D</li>
  * <li>w - Width of raster</li>
  * <li>h - Height of raster</li>
  * <li>a - Angle calculated as atan2(y/x)</li>
  * <li>d - Distance to the center</li>
  * </ul>
  * @example <caption>Fill with a spiral</caption>
  * const DEG = Math.PI / 180;
  * const spiral = (pix,i,x,y,z,w,h,a,d) => 128 * (Math.sin(d / 10+ a * DEG)+1);
  * let raster = T.fill(spiral)(img.getRaster() );
  * @param {Raster} raster - Input Raster
  * @param {boolean} copy_mode - Useless, here. Only for compatibility with other process functions
  *
  * @author Jean-Christophe Taveau
  */
const math = (func) => (raster,copy_mode=true) => {
  // TODO
  // cpu.fill(func)(T.Raster.from(raster,copy_mode),copy_mode);
};

/**
 * Image Calculator. Combine two images by operation
 *
 * @param {Raster} raster - Input Raster
 * @param {function} func - Function for computation
 * @param {Raster} raster - Input Raster
 * @param {boolean} copy_mode - Copy mode to manage memory usage.
 * @example <caption>Addition of two uint8 rasters with clamping</caption>
 * let raster3 = T.calc(raster1, (px1,px2) => T.clampUint8(px1 + px2) )(raster2)
 *
 * @author Jean-Christophe Taveau
 */
const calc = (other,func) => (raster,copy_mode=true) => {
  // TODO Assume two raster have same dimension

  return output;
};

// Export
export {fill};

