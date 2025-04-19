import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Animatable from 'react-native-animatable';

const SpiralLoader = () => {
  const htmlContent = String.raw`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            //background: #040404;
            background:rgb(255, 255, 255);
            overflow: hidden;
            marginTop: - 40px;
            padding: 0;
          }
          canvas {
            display: block;
            margin: 0 auto;
            background: transparent;
          }
        </style>
      </head>
      <body>
        <canvas></canvas>
        <script>
          class Particle {
            constructor(opt) {
              this.x = opt.x;
              this.y = opt.y;
              this.angle = opt.angle;
              this.speed = opt.speed;
              this.accel = opt.accel;
              this.radius = 2.5; // más pequeño
              this.decay = 0.01;
              this.life = 1;
            }

            step(i) {
              this.speed += this.accel;
              this.x += Math.cos(this.angle) * this.speed;
              this.y += Math.sin(this.angle) * this.speed;
              this.angle += Math.PI / 64;
              this.accel *= 1.01;
              this.life -= this.decay;

              if (this.life <= 0) {
                particles.splice(i, 1);
              }
            }

            draw(i) {
              ctx.fillStyle = 'hsla(' + (tick + this.life * 120) + ', 100%, 60%, ' + this.life + ')';
              ctx.strokeStyle = ctx.fillStyle;
              ctx.beginPath();
              if (particles[i - 1]) {
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(particles[i - 1].x, particles[i - 1].y);
              }
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(this.x, this.y, Math.max(0.001, this.life * this.radius), 0, TAU);
              ctx.fill();

              let size = Math.random() * 0.5; // partículas dispersas más pequeñas
              ctx.fillRect(
                ~~(this.x + (Math.random() - 0.5) * 10 * this.life), // menos dispersión
                ~~(this.y + (Math.random() - 0.5) * 10 * this.life),
                size,
                size
              );
            }
          }

          const PI = Math.PI;
          const TAU = PI * 2;
          const canvas = document.querySelector('canvas');
          const ctx = canvas.getContext('2d');
          const width = 100;
          const height = 100;
          const centerX = width / 2 + 10;
          const centerY = height / 2 + 40;
          const min = width * 0.25;
          const particles = [];
          let globalAngle = 0;
          let tick = 0;
          let now = 0;
          let frameDiff = 0;
          let lastFrame = 0;

          canvas.width = width;
          canvas.height = height;
          ctx.globalCompositeOperation = 'lighter';

          function step() {
            particles.push(new Particle({
              x: centerX + Math.cos(tick / 20) * min / 2,
              y: centerY + Math.sin(tick / 20) * min / 2,
              angle: globalAngle,
              speed: 0,
              accel: 0.005 // más suave
            }));
            particles.forEach((particle, i) => {
              particle.step(i);
            });

            globalAngle += PI / 3;
          }

          function draw() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((particle, i) => {
              particle.draw(i);
            });
          }

          function loop() {
            window.requestAnimationFrame(loop);
            now = Date.now();
            frameDiff = now - lastFrame;
            if (frameDiff >= 1000 / 60) {
              lastFrame = now;
              step();
              draw();
              tick++;
            }
          }

          loop();
        </script>
      </body>
    </html>
  `;

  return (
    <Animatable.View
      animation="zoomIn"
      duration={2000}
      delay={2000}
      style={{
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -80,
      }}
    >
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'transparent',
        }}
        scrollEnabled={false}
      />
    </Animatable.View>
  );
};

export default SpiralLoader;
