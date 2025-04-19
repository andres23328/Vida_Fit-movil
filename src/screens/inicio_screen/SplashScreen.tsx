import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
  Image,
  findNodeHandle,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import SpiralLoader from './SpiralLoader'; 
import DeadlineLoader from './DeadlineLoader'


interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  position: Animated.ValueXY;
  velocity: { x: number; y: number };
  color: string;
  currentPos: { x: number; y: number };
}

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const logoContainerRef = useRef<View>(null);

  useEffect(() => {
    setTimeout(() => {
      if (logoContainerRef.current) {
        const handle = findNodeHandle(logoContainerRef.current);
        if (handle) {
          logoContainerRef.current.measureInWindow((x, y, w, h) => {
            // Desplazamos las partículas al lado del logo
            const centerX = x + w / 2 - 200; // Desplazado hacia la derecha
            const centerY = y + h / 2 - 370; // Desplazado hacia abajo
            launchParticlesFrom(centerX, centerY); // Lanza las partículas desde esta posición
          });
        }
      }
    }, 500);
  }, []);

  const launchParticlesFrom = (centerX: number, centerY: number) => {
    const NUM_PARTICLES = 20;
    const SPEED_MULTIPLIER = 18; // Aceleración de partículas (más rápido)

    const initialParticles: Particle[] = [];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = SPEED_MULTIPLIER + Math.random() * 5; // Aumento de velocidad

      initialParticles.push({
        id: i,
        position: new Animated.ValueXY({ x: centerX, y: centerY }),
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        },
        color: generateRandomColor(),
        currentPos: { x: centerX, y: centerY },
      });
    }

    setParticles(initialParticles);
    particlesRef.current = initialParticles;

    let animationFrameId: number;

    const BOUNCE_MARGIN = -190; 
    const BOUNCE_Y = -410; 
    const BOUNCE_MARGIN1 = 210;
    const BOUNCE_Y1 = 400; 
    const animateParticles = () => {
      particlesRef.current.forEach((particle) => {
        let { x, y } = particle.currentPos;
        let { x: dx, y: dy } = particle.velocity;
    
        // Movimiento más fluido
        const newX = x + dx;
        const newY = y + dy;
    
        // Rebote en los bordes de la pantalla completa con margen
        if (newX <= BOUNCE_MARGIN || newX >= width - BOUNCE_MARGIN1) particle.velocity.x *= -1; // Rebotar horizontal
        if (newY <= BOUNCE_Y || newY >= height - BOUNCE_Y1) particle.velocity.y *= -1; // Rebotar vertical
    
        particle.currentPos = { x: newX, y: newY };
        particle.position.setValue({ x: newX, y: newY });
      });
    
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Llamada a onFinish después de 10 segundos
    const timer = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      onFinish();
    }, 10000);
  };

  return (
    <View style={styles.container}>
      {/* Partículas */}
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              transform: particle.position.getTranslateTransform(),
            },
          ]}
        />
      ))}

      {/* Contenedor del logo con ref */}
      <View ref={logoContainerRef}>
        <Animatable.Image
          source={require('../../../assets/imagenes/logo.jpeg')}
          animation="bounceIn"
          duration={1500}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Texto */}
      <Animatable.Text
        style={styles.title}
        animation="fadeInUp"
        duration={2000}
        delay={1000}
      >
        Cargando tu experiencia...
      </Animatable.Text>

      {/* Cargando */}
{/*       <Animatable.View animation="zoomIn" duration={2000} delay={2000}>
        <SpiralLoader />
      </Animatable.View>  */}

      <Animatable.View animation="zoomIn" duration={2000} delay={2000}>
        <ActivityIndicator size="large" color="#000000" />
      </Animatable.View>  

{/*       <DeadlineLoader />
 */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 20,
    zIndex: 1,
  },
  particle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    opacity: 0.8,
    zIndex: 2,
  },
});
