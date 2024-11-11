import Effects from '@components/3d/effects/Effects.tsx'
import Scene3d from '@components/3d/scene/Scene3d.tsx'
import UI from '@components/ui/UI.tsx'
import { Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { NamesLiteral } from '@utils/names.ts'
import { useState } from 'react'
import styles from './App.module.css'

function App() {
  const [randomName, setRandomName] = useState<NamesLiteral | undefined>(
    undefined,
  )
  const onNameSelect = (name?: NamesLiteral) => {
    setRandomName(name)
  }

  return (
    <div className={styles.app}>
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
        <Scene3d randomName={randomName} />
        <Effects />
        <Environment
          preset="studio"
          environmentRotation={[0, (20 * Math.PI) / 180, 0]}
          environmentIntensity={0.3}
        />
      </Canvas>
      <UI onNameSelect={onNameSelect} />
    </div>
  )
}

export default App
