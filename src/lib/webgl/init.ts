/**
 * Builds WebGL environment
 * @param canvas 
 * @returns 
 */
export const init = (canvas: HTMLCanvasElement): WebGLRenderingContext => {
  const gl = canvas.getContext('webgl');
  if (!gl) throw new Error('WebGL not supported');
  gl.viewport(0, 0, canvas.width, canvas.height);
  return gl;
};
