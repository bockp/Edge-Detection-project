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
 * Toolbox for GPU
 *
 */

/**
 * Create a GPU Processor
 *
 * @author Jean-Christophe Taveau
 */
const createGPU = (graphics,width=-1,height=-1) => new gpu.Processor(graphics.context,graphics.canvas,width,height);
  

/**
 *
 * Init WebGL2
 *
 */
const getGraphicsContext = (elementID='preview') => {
  // http://webglreport.com/
  let _canvas = document.getElementById(elementID);
  let gl2;
  let _params = {};
  
  try {
    gl2 = _canvas.getContext("webgl2");
    // Need extension(s)
    const ext = gl2.getExtension("EXT_color_buffer_float");
    if (!ext) {
      alert("need EXT_color_buffer_float");
    }
    // Various useful configuration parameters
    _params.maxTextures  = gl2.getParameter(gl2.MAX_TEXTURE_IMAGE_UNITS);
    _params.maxTextureSize  = gl2.getParameter(gl2.MAX_TEXTURE_SIZE);
    
  } catch (e) {
  }
  if (!gl2) {
      alert("Could not initialise WebGL2, sorry :-(");
  }
  return {canvas: _canvas, context: gl2, parameters: _params};
};


/**
 *
 * Create Shader Program
 *
 */
const createProgram = (gpuEnv,src_vs,src_fs) => {

  // Compile shader
  const compileShader = (gl, source,type) => {
    let str = source;

    let shader;
    if (type == "fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(` ${type}: ${gl.getShaderInfoLog(shader)}`);
      return null;
    }

    return shader;
  };

  /**** MAIN ****/
  
  let shader = {
    program: null,
    attributes: {},
    uniforms: {}
  };

  let gl = gpuEnv.context;
  
  //1- Check in source(s) where are the attributes (keyword`in `)
  let re = /in\s*(\w+)\s(\w+)/gm;
  let result;
  while ((result = re.exec(src_vs)) !== null) {
    // console.log(re.exec(src_vs));
    shader.attributes[result[2]] = {type: result[1],name: result[2],location: null};
  }
  // Check in source(s) where are the uniforms (keyword: `uniform`)
  re = /uniform\s*(\w+)\s+(\w+)\s*(\[)*/gm;
  while ((result = re.exec(src_vs)) !== null) {
    // console.log(re.exec(src_vs));
    shader.uniforms[result[2]] = {type: result[1]+(result[3]?'[]':''),name: result[2],location: null};
  }
  while ((result = re.exec(src_fs)) !== null) {
    // console.log(re.exec(src_vs));
    shader.uniforms[result[2]] = {type: result[1]+(result[3]?'[]':''),name: result[2],location: null};
  }
  console.log(shader);

  // 2- Create Shader Program with link step.
  shader.program = gl.createProgram();
  
  gl.attachShader(shader.program, compileShader(gl,src_vs,'vertex'));
  gl.attachShader(shader.program, compileShader(gl,src_fs,'fragment'));
  gl.linkProgram(shader.program);

  if (!gl.getProgramParameter(shader.program, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }
  
  // 3- Get Attribute and Uniform locations
  Object.values(shader.attributes).forEach( (attr) => attr.location =  gl.getAttribLocation(shader.program, attr.name) );
  Object.values(shader.uniforms).forEach( (uniform) => uniform.location =  gl.getUniformLocation(shader.program, uniform.name) );
  return shader;
}

/**
 * Create a rectangle for gpu.Processor.geometry(..) function
 *
 * @author Jean-Christophe Taveau
 */

const rectangle = (w,h) => ({
    type: gpu.TRIANGLE_STRIP, 
    num: 4,
    vertices: new Float32Array(
      [
        0.0,0.0,0.0,0.0,
        0.0,h  ,0.0,1.0,
        w  ,0.0,1.0,0.0,
        w  ,h  ,1.0,1.0
      ]
    )
  });

// Export
export {createGPU,getGraphicsContext,createProgram,rectangle};


