import Effects from '@components/3d/effects/Effects.tsx'
import Scene3d from '@components/3d/scene/Scene3d.tsx'
import UI from '@components/ui/UI.tsx'
import { Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import styles from './App.module.css'

function App() {
  const [hasSelectedName, setHasSelectedName] = useState(false)
  const onNameSelect = () => {
    setHasSelectedName(true)
  }

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
        <Scene3d hasSelectedName={hasSelectedName} />
        <Effects />
        <Environment
          preset="studio"
          environmentRotation={[0, (20 * Math.PI) / 180, 0]}
          environmentIntensity={0.3}
        />
      </Canvas>
      <UI onNameSelect={onNameSelect} />
    </>
  )
}

export default App
