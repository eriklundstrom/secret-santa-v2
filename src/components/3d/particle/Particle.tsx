import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import gsap from 'gsap'
import { useRef } from 'react'
import { Mesh, SpriteMaterial } from 'three'
import particleImageUrl from './particle.png'

function r(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function Particle() {
  const ref = useRef<Mesh>(null!)
  const material = useRef<SpriteMaterial>(null!)
  const texture = useTexture(particleImageUrl)
  const v = 0.4

  useGSAP(
    () => {
      const positionTarget = { x: 0, y: 0, z: 0, progress: 0 }
      gsap.fromTo(
        positionTarget,
        { x: r(-v, v), y: r(-v, v), z: r(-v, v), progress: 0 },
        {
          duration: r(1, 10),
          x: `random(-${v}, ${v})`,
          y: `random(-${v}, ${v})`,
          z: `random(-${v}, ${v})`,
          progress: 1,
          onUpdate: () => {
            ref.current.position.set(
              positionTarget.x,
              positionTarget.y,
              positionTarget.z,
            )
            material.current.opacity = Math.sin(
              positionTarget.progress * Math.PI,
            )
          },
          repeat: -1,
          repeatRefresh: true,
        },
      )
    },
    { scope: ref },
  )

  return (
    <mesh ref={ref} scale={r(0.3, 0.5)}>
      <sprite>
        <spriteMaterial
          ref={material}
          map={texture}
          transparent={true}
          opacity={0.5}
          color={0x550000}
        />
      </sprite>
    </mesh>
  )
}

export default Particle
