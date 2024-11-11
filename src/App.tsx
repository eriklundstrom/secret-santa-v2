import Effects from '@components/3d/effects/Effects.tsx'
import Scene3d from '@components/3d/scene/Scene3d.tsx'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import styles from './App.module.css'

function App() {
  return (
    <>
      <Canvas
        className={styles.canvas}
        flat
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        camera={{
          position: [3, 1, 2],
          fov: 40, // 40
          near: 1,
          far: 20,
        }}
      >
        <OrbitControls />
        <Scene3d />
        <Effects />
        <Environment
          preset="studio"
          environmentRotation={[0, (20 * Math.PI) / 180, 0]}
          environmentIntensity={0.3}
        />
      </Canvas>
    </>
  )
}

export default App
