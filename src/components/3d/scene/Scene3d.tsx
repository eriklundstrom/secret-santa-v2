import Model3dBalls from '@components/3d/balls/Balls.tsx'
import Model3dPresent from '@components/3d/present/Present.tsx'
import { useFrame } from '@react-three/fiber'
import { deg2rad } from '@utils/deg2rad.ts'
import { NamesLiteral } from '@utils/names.ts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Group, MathUtils } from 'three'

type Props = {
  randomName?: NamesLiteral
}

function Scene3d({ randomName }: Props) {
  const balls = useRef<Group>(null!)
  const present = useRef<Group>(null!)
  const mouseMovementTarget = useRef<Group>(null!)
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const handleMove = useCallback((e: MouseEvent) => {
    const x = e.offsetX - window.innerWidth / 2
    const y = e.offsetY - window.innerHeight / 2
    const pX = x / window.innerWidth
    const pY = y / window.innerHeight

    setMouseOffset(() => ({ x: pX, y: pY }))
  }, [])

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const absolute = e.absolute
    const alpha = e.alpha || 0
    const beta = e.beta || 0
    const gamma = e.gamma || 0

    setMouseOffset(() => ({ x: alpha * 10, y: beta * 10 }))

    console.log(absolute, alpha, beta, gamma)
  }, [])

  useFrame(() => {
    if (!randomName) return
    present.current.rotation.y = MathUtils.lerp(
      present.current.rotation.y,
      deg2rad(mouseOffset.x * 0.25),
      0.1,
    )

    balls.current.rotation.y = MathUtils.lerp(
      balls.current.rotation.y,
      deg2rad(mouseOffset.x * 0.01),
      0.1,
    )
  })

  useEffect(() => {
    if (randomName) {
      // window.addEventListener('mousemove', handleMove)
      window.addEventListener('deviceorientation', handleOrientation, true)
    }

    return () => {
      // window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [randomName, handleMove, handleOrientation])

  return (
    <group ref={mouseMovementTarget}>
      <Model3dBalls ref={balls} show={!!randomName} />
      <Model3dPresent
        ref={present}
        show={!!randomName}
        randomName={randomName}
      />
    </group>
  )
}

export default Scene3d
