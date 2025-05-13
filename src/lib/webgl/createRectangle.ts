/**
 * 
 * @param gl 
 * @returns 
 */
export function createRectangle(gl: WebGLRenderingContext): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const vertices = new Float32Array([
    -10, -10,
    10, -10,
    -10, 10,
    -10, 10,
    10, -10,
    10, 10,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  return buffer;
}