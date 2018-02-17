const SOBEL_H = [1, 0, -1, 2, 0, -2, 1, 0, -1];
const SOBEL_V = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
const PREWITT_H = [1, 0, -1, 1, 0, -1, 1, 0, -1];
const PREWITT_V = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
const ROBERT_H = [0, -1, 0, 1, 0, 0, 0, 0, 0];
const ROBERT_V = [-1, 0, 0, 0, 1, 0, 0, 0, 0];

const gpuEdgePrewitt = () => (raster, gpuEnv, copy = true) =>
  {gpuEdge(raster, gpuEnv, PREWITT_H, PREWITT_V);
  return raster;
  };

const gpuEdgeSobel = () => (raster, gpuEnv, copy = true) =>
  {gpuEdge(raster, gpuEnv, SOBEL_H, SOBEL_V);
  return raster;
  };

const gpuEdgeRobert = () => (raster, gpuEnv, copy = true) =>
  {gpuEdge(raster, gpuEnv, ROBERT_H, ROBERT_V);
  return raster;
  };


const gpuEdge = (raster, gpuEnv, kernelH, kernelV, copy = true) =>
{
  //let gpuEnv = gpu.getGraphicsContext('preview');
  //console.log(gpuEnv);

  let id = "sobel";
  console.log(id);

  // Vertex Shader
  const src_vs = `#version 300 es
    in vec2 a_vertex;
    in vec2 a_texCoord;
    uniform vec2 u_resolution;
    out vec2 v_texCoord;

    void main() {
      v_texCoord = a_texCoord;
      vec2 clipSpace = a_vertex * u_resolution * 2.0 - 1.0;
      gl_Position = vec4(clipSpace * vec2(1.0,-1.0), 0.0, 1.0);
    }`;

  console.log("vertex shader done");

  // outputV = (x >= threshold) ? 255 : 0;

  console.log(raster.type);

  // other types : "uint8" "float32" "rgba"

  let ajustRasterTypePrefix = (raster.type == "uint16" ) ? `float(` : `` ;
  let ajustRasterTypeSuffix = (raster.type == "uint16" ) ? `)` : `` ;

  //console.log(ajustTypeRasterSuffix);

  // Fragment Shader
  const src_fs = `#version 300 es
    precision mediump float;

    in vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform float KERNEL_H[9];
    uniform float KERNEL_V[9];
    out vec4 outputColor;

    void main() {
      float stepSizeX = 1.0 / float(textureSize(u_image,0).x);
      float stepSizeY = 1.0 / float(textureSize(u_image,0).y);

      // get surrounding pixels used with the kernel
      float a11 = `+ajustRasterTypePrefix+`texture(u_image, v_texCoord - vec2(stepSizeX,stepSizeY)).r`+ajustRasterTypeSuffix+`;
      float a12 = `+ajustRasterTypePrefix+`texture(u_image, vec2(v_texCoord.s, v_texCoord.t - stepSizeY)).r`+ajustRasterTypeSuffix+`;
      float a13 = `+ajustRasterTypePrefix+`texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t - stepSizeY)).r`+ajustRasterTypeSuffix+`;

      float a21 = `+ajustRasterTypePrefix+`texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t)).r`+ajustRasterTypeSuffix+`;
      float a22 = `+ajustRasterTypePrefix+`texture(u_image, v_texCoord).r`+ajustRasterTypeSuffix+`;
      float a23 = `+ajustRasterTypePrefix+`texture(u_image, vec2(v_texCoord.s + stepSizeX, v_texCoord.t)).r`+ajustRasterTypeSuffix+`;

      float a31 = `+ajustRasterTypePrefix+`texture(u_image, vec2(v_texCoord.s - stepSizeX, v_texCoord.t + stepSizeY)).r`+ajustRasterTypeSuffix+`;
      float a32 = `+ajustRasterTypePrefix+`texture(u_image, vec2(v_texCoord.s, v_texCoord.t + stepSizeX)).r`+ajustRasterTypeSuffix+`;
      float a33 = `+ajustRasterTypePrefix+`texture(u_image, v_texCoord + vec2(stepSizeX,stepSizeY)).r`+ajustRasterTypeSuffix+`;

      vec2 convolution = vec2 (KERNEL_H[0] * a11 + KERNEL_H[1] * a12 + KERNEL_H[2] * a13 + KERNEL_H[3] * a21 + KERNEL_H[4] * a22 + KERNEL_H[5] * a23 + KERNEL_H[6] * a31 + KERNEL_H[7] * a32 + KERNEL_H[8] * a33,
        KERNEL_V[0] * a11 + KERNEL_V[1] * a12 + KERNEL_V[2] * a13 + KERNEL_V[3] * a21 + KERNEL_V[4] * a22 + KERNEL_V[5] * a23 + KERNEL_V[6] * a31 + KERNEL_V[7] * a32 + KERNEL_V[8] * a33);

      outputColor.r = sqrt((convolution.x*convolution.x) + (convolution.y*convolution.y)) ;
      outputColor.g = outputColor.r;
      outputColor.b = outputColor.r;
      outputColor.a = 1.0;
  }`;

  //console.log(src_fs);

  let edge = gpu.createProgram(gpuEnv,src_vs,src_fs);

  let gprocEdge = gpu.createGPU(gpuEnv)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height)) // double triangle already done by gpu_utils
    .attribute('a_vertex', 2, 'float', 16, 0) // X, Y
    .attribute('a_texCoord', 2, 'float', 16, 8) // S, T
    .texture(raster, 0)
    .packWith(edge) // VAO
    .clearCanvas([0.0,1.0,0.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image', 0)
    .uniform('KERNEL_H',new Float32Array(kernelH))
    .uniform('KERNEL_V',new Float32Array(kernelV))
    .run();

  return raster;

};
