import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import styles from './App.module.css'
import Effects from './components/3d/effects/Effects.tsx'
import Model3dPresent from './components/3d/present/Present.tsx'

function App() {
  return (
    <>
      <Canvas
        className={styles.canvas}
        flat
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{
          position: [3, 1, 2],
          fov: 25,
          near: 1,
          far: 20,
        }}
      >
        <OrbitControls />
        <Model3dPresent />
        <Effects />
        <Environment
          preset="studio"
          environmentRotation={[0, (70 * Math.PI) / 180, 0]}
          environmentIntensity={0.3}
        />
      </Canvas>
    </>
  )
}

export default App
