import Model3dBalls from '@components/3d/balls/Balls.tsx'
import Model3dPresent from '@components/3d/present/Present.tsx'
import { useFrame } from '@react-three/fiber'
import { deg2rad } from '@utils/deg2rad.ts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Group, MathUtils } from 'three'

type Props = {
  hasSelectedName: boolean
}

function Scene3d({ hasSelectedName }: Props) {
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
    const pX = (x / window.innerWidth) * 100
    const pY = (y / window.innerHeight) * 100

    setMouseOffset(() => ({ x: pX, y: pY }))
  }, [])

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const absolute = e.absolute
    const alpha = e.alpha || 0
    const beta = e.beta || 0
    const gamma = e.gamma || 0

    setMouseOffset(() => ({ x: alpha * 1000, y: beta * 1000 }))

    console.log(absolute, alpha, beta, gamma)
  }, [])

  useFrame(() => {
    if (!hasSelectedName) return
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
    if (hasSelectedName) {
      window.addEventListener('mousemove', handleMove)
      window.addEventListener('deviceorientation', handleOrientation, true)
    }

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [hasSelectedName, handleMove, handleOrientation])

  return (
    <group ref={mouseMovementTarget}>
      <Model3dBalls ref={balls} show={hasSelectedName} />
      <Model3dPresent ref={present} show={hasSelectedName} />
    </group>
  )
}

export default Scene3d
