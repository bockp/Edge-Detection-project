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


export class Processor {
  constructor(context,canvas,width=-1,height=-1) {
    this.context = context; 
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.geometries = {};
    this.textures = [];
    this.attributes= {};
    this.uniforms = {};
    this.framebuffers = {};
  }

  attribute(a_name,a_num,a_type,a_stride,a_offset) {
    this.attributes[a_name] = {
      name: a_name,
      num : a_num,
      type: a_type, 
      stride: a_stride,
      offset: a_offset,
      location: null
    };
    return this;
  }

  clearCanvas(color = [0.1,0.1,0.1,1.0]) {
    let gl = this.context;
    
    // clear color
    gl.clearColor(color[0],color[1],color[2],color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    return this;
  }
  
  /**
   *
   * primitives:
   * - type: TRIANGLE_STRIP, POINTS, TRIANGLES, LINES
   * - vertices: Float32Array([])
   */
  geometry(obj) {
    let gl = this.context;
    
    // Create vertices for rectangle
    this.geometries.type = obj.type;
    this.geometries.glType = obj.type;
    this.geometries.buffer = gl.createBuffer();
    this.geometries.numVertices = obj.num;
    gl.bindBuffer(gl.ARRAY_BUFFER,this.geometries.buffer);
    gl.bufferData(gl.ARRAY_BUFFER,obj.vertices,gl.STATIC_DRAW);

    // Unbind buffer(s)
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return this;
  }
  
  /**
   *
   */
   packWith(shaderProgram) {
      let gl = this.context;
      
      this.shader = shaderProgram;
      
      // 1- Get Attribute and Uniform locations
      Object.values(this.attributes).forEach( (attr) => {
        attr.location =  shaderProgram.attributes[attr.name].location;
        attr.component =  shaderProgram.attributes[attr.name].type;
      });
      
      console.log(this.attributes);
      
      // 2- Create a VAO
      this.vao = gl.createVertexArray();
      gl.bindVertexArray(this.vao);
      // 3- Bind the position buffer containing the vertices
      gl.bindBuffer(gl.ARRAY_BUFFER, this.geometries.buffer);
      // 4- Attributes
      Object.values(this.attributes).forEach( (a) => {
        console.log(a);
        gl.enableVertexAttribArray(this.attributes[a.name].location);
        gl.vertexAttribPointer(
          this.attributes[a.name].location, 
          this.attributes[a.name].num, 
          gl.FLOAT, 
          false, 
          this.attributes[a.name].stride, 
          this.attributes[a.name].offset
        );
        }
      );
      // Unbind buffers
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindVertexArray(null);
      return this;
   }
   
  /**
   * Render in a Frame Buffer
   */
  redirectTo(fbo_name,type='uint8',attachment=0) {
    let gl = this.context;
    
    // Be sure no active framebuffer somewhere
    // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);
    
    if (this.framebuffers[fbo_name] === undefined) {
      console.log('CREATE FBO');
      let fbo = gl.createFramebuffer();
      
      let [internalFormat, srcType, data] = (type == 'uint16' || type === 'float32') ? 
        [gl.RGBA32F,gl.FLOAT, new Float32Array(this.width * this.height * 4)] : 
        [gl.RGBA,gl.UNSIGNED_BYTE, new Uint8ClampedArray(this.width * this.height * 4)];


      let texture = this._createTexture(
        gl,
        data,
        this.width,
        this.height,
        internalFormat,
        gl.RGBA,
        srcType,
        gl.CLAMP_TO_EDGE,
        gl.NEAREST,
        gl.NEAREST
      );
        
      gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0 + attachment,
        gl.TEXTURE_2D,
        texture,
        0
      );
      
      this.framebuffers[fbo_name] = {
        id: 'framebuffer',
        name: fbo_name,
        buffer: fbo,
        texture: texture,
        format: internalFormat,
        srcType: srcType
      };
    }
    else {
      gl.bindFramebuffer(gl.FRAMEBUFFER,this.framebuffers[fbo_name].buffer);
    }
    
    gl.bindTexture(gl.TEXTURE_2D, this.framebuffers[fbo_name].texture);

    
    return this;
  }
  
  /**
   * Update canvas size
   */
  size(w,h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.width = w;
    this.height = h;
    return this;
  }
  
  /*
   * Pseudo-private - for Internal use, only
   */
  _createTexture (context,data,w,h,iformat,format,type, wrap,mini, mag) {
    let gl = context;
    
    // Define a PBO for texture data?
    // https://stackoverflow.com/questions/43530082/how-can-i-upload-a-texture-in-webgl2-using-a-pixel-buffer-objecthttps://www.khronos.org/webgl/public-mailing-list/public_webgl/1701/msg00036.php
    // https://www.khronos.org/webgl/public-mailing-list/public_webgl/1701/msg00036.php

    // const tex = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, tex);
    // take data from PBO
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 300, 150, 0, gl.RGBA, gl.UNSIGNED_BYTE, 0);
    
    // Create a Pixel Buffer Object (PBO) for fast access to pixel data
    const pbo = gl.createBuffer();
    gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pbo);
    gl.bufferData(gl.PIXEL_UNPACK_BUFFER, data, gl.STATIC_DRAW);
    // data is now in PBO
    
    // Create a texture
    let texture = gl.createTexture();

    // Bind it to texture unit 0' 2D bind point
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we don't need mips and so we're not filtering
    // and we don't repeat
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mini);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag);
    // Upload the image into the texture.
    let mipLevel = 0;              // the largest mip
    let internalFormat = iformat;   // format we want in the texture
    let srcFormat = format;        // format of data we are supplying
    let srcType = type;            // type of data we are supplying
    
    gl.texImage2D(
      gl.TEXTURE_2D,
      mipLevel,
      internalFormat,
      w,
      h,
      0, // Border
      srcFormat,
      srcType,
      0 // data already in PBO
    );

    // Job finished: Unbind texture
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    return texture;
  };

  /**
   * Create and set up several textures
   *
   * @param {[Object]} array - Array of texture object. The pixel data must be stored as a Raster
   */
  textures(array) {
    // TODO
    array.forEach( (tex) => this.texture(tex.raster,tex.unit,tex.wrap,tex.mini,tex.mag));
    return this;
  }
  
  /**
   * Create and set up a texture
   *
   */
  texture(raster,unit=0, wrap=gpu.CLAMP,mini=gpu.NEAREST, mag= gpu.NEAREST) {
  
    if (raster.id !== undefined && raster.id === 'framebuffer') {
      console.log('This is a FBO...');
      this.textures[0] = {texture: raster.texture, unit: unit};
      return this;
    }
    
    let gl = this.context;
    
    const glConstants = {
      'clamp' : gl.CLAMP_TO_EDGE,
      'repeat' : gl.REPEAT,
      'mirror' : gl.MIRRORED_REPEAT,
      'nearest' : gl.NEAREST,
      'uint8': gl.UNSIGNED_BYTE,
      'uint16': gl.UNSIGNED_SHORT,
      'float32': gl.FLOAT,
      'rgba' : gl.UNSIGNED_BYTE,
      'gray' : gl.LUMINANCE,
      'color': gl.RGBA
    }
  
     
    this.width = raster.width;
    this.height = raster.height;
    
    let texture = this._createTexture(
      gl,
      raster.pixelData,
      raster.width,
      raster.height,
      (raster.type === 'uint8' || raster.type === 'uint16' || raster.type === 'float32') ? gl.LUMINANCE : gl.RGBA,
      (raster.type === 'uint8' || raster.type === 'uint16' || raster.type === 'float32') ? gl.LUMINANCE : gl.RGBA,
      glConstants[raster.type],
      wrap,
      mini,
      mag
    );
    

    this.textures.push({texture: texture, unit: unit});
    
    return this;
  }

  /** 
   * Configure the rendering/computing engine before run(..)
   *
   * @author Jean-Christophe Taveau
   */
  preprocess(settings=[]) {
    let gl = this.context;
    
    // console.log(settings);
    // Add Default viewport
    if (settings.find( (elt) => (elt.name === 'viewport')) === undefined) {
      settings.push({name:'viewport', params: [0.0,0.0, this.width, this.height]});
    } 

    // Add various rendering parameters
    
    // Blending operations 
    // gl.enable(gl.BLEND);
    // viewport operations 
    // TODO

    settings.forEach( (s) => {
      switch (s.name) {
      case 'blend': 
        gl.blendEquation(s.params[0]);
        gl.blendFunc(s.params[1], s.params[2]);
        gl.enable(gl.BLEND);
        break;
      case 'viewport': 
        gl.viewport(s.params[0],s.params[1],s.params[2],s.params[3]);
        break;
      }
    });
    

    // Activate shader program
    gl.useProgram(this.shader.program);
    
    return this;
  }
  
  /**
   *
   */
  postprocess() {
    // Clean ?
    // gl.disable(settings)?
    return this;
  }
  

/**
 * 
 */
 readPixels(fbo_name) {
  let gl = this.context;
  
  // http://roxlu.com/2014/048/fast-pixel-transfers-with-pixel-buffer-objects
  // https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance2/reading/read-pixels-from-rgb8-into-pbo-bug.html
  let fbo = this.framebuffers[fbo_name];
  gl.bindFramebuffer(gl.FRAMEBUFFER,fbo.buffer);
  gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

  // console.log(this.width, this.height);
  let data = new Float32Array(this.width * this.height * 4); // RGBA
  gl.readPixels(0, 0, this.width, this.height, gl.RGBA, fbo.srcType, data);
  
  return data;
  
 }
 
 
  /**
   *
   */
  run() {
    let gl = this.context;
    
    // Bind the position buffer containing the vertices (ie rectangle)
    gl.bindVertexArray(this.vao);

    this.textures.forEach( (tex) => {
      gl.activeTexture(gl.TEXTURE0 + tex.unit);
      gl.bindTexture(gl.TEXTURE_2D, tex.texture);
    });

    gl.drawArrays(this.geometries.glType,0,this.geometries.numVertices);
    
    // Clean up
    // TODO
    gl.bindTexture(gl.TEXTURE_2D,null);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);
    
    return this;
  }

 
  /**
   *
   */
  uniform(u_name,u_value) {
    let gl = this.context;
    
    let u = this.shader.uniforms[u_name];

    switch (u.type) {
      case 'float': gl.uniform1f(u.location, u_value);break;
      case 'int': gl.uniform1i(u.location, u_value);break;
      case 'uint': gl.uniform1ui(u.location, u_value);break;
      case 'int[]': gl.uniform1iv(u.location, u_value);break;
      case 'float[]': gl.uniform1fv(u.location, u_value);break;
      case 'mat2': gl.uniformMatrix2fv(u.location, u_value);break;
      case 'mat3': gl.uniformMatrix3fv(u.location, u_value);break;
      case 'mat4': gl.uniformMatrix4fv(u.location, u_value);break;
      case 'sampler2D': gl.uniform1i(u.location, u_value);break;
      case 'vec2': gl.uniform2fv(u.location, u_value);break;
      case 'vec3': gl.uniform3fv(u.location, u_value);break;
      case 'vec4': gl.uniform4fv(u.location, u_value);break;
    };
    return this;
   }
   
}



