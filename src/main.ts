import './style.css';
import { init } from './lib/webgl/init';
import { GameCamera } from './lib/camera';
import { createProgram } from './lib/webgl/createProgram';
import { vertexShaderSrc } from './lib/webgl/shaders/vertex';
import { fragmentShaderSrc } from './lib/webgl/shaders/fragment';
import { createRectangle } from './lib/webgl/createRectangle';
import { multiplyMatrix3 } from './lib/webgl/multiplyMatrix';

// Render the canvas
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <canvas id="game"></canvas>
  </main>
`;
const canvas = document.getElementById('game') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Build WebGL program
const gl = init(canvas);
const program = createProgram(gl, vertexShaderSrc, fragmentShaderSrc);
const rectangle = createRectangle(gl);
const aPosition = gl.getAttribLocation(program, 'a_position');
const uMatrix = gl.getUniformLocation(program, 'u_matrix');
const uColor = gl.getUniformLocation(program, 'u_color');

// Render the camera
const camera = new GameCamera(canvas.width, canvas.height);

// Setup game objects
const players = [
  { x: -100, y: 0, color: [1, 0, 0, 1] },
  { x: 100, y: 0, color: [0, 1, 0, 1] },
];

// Main loop
function gameLoop(time: number) {
  for (let i = 0; i < players.length; i++) {
    players[i].x = Math.sin(time / 1000 + i) * 200;
    players[i].y = Math.cos(time / 1000 + i) * 100;
  }

  camera.update(players);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.1, 0.1, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangle);
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  // for (const player of players) {
  //   const mat = camera.getMatrix(player.x, player.y);
  //   gl.uniformMatrix3fv(uMatrix, false, mat);
  //   gl.uniform4fv(uColor, player.color);
  //   gl.drawArrays(gl.TRIANGLES, 0, 6);
  // }

  const viewMatrix = camera.getViewMatrix();

  for (const player of players) {
    // Translation matrix for player
    const modelMatrix = new Float32Array([
      1, 0, 0,
      0, 1, 0,
      player.x, player.y, 1,
    ]);

    // Multiply view * model
    const finalMatrix = multiplyMatrix3(modelMatrix, viewMatrix);

    gl.uniformMatrix3fv(uMatrix, false, finalMatrix);
    gl.uniform4fv(uColor, player.color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
