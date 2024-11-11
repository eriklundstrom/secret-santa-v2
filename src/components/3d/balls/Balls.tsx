import { useGSAP } from '@gsap/react'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { forwardRef, useEffect, useRef } from 'react'
import { Group, MeshPhysicalMaterial } from 'three'
import modalUrl from './balls.glb'

type Props = {
  show: boolean
}

const Model3dBalls = forwardRef<Group, Props>(function Model3dBalls(
  { show },
  ref,
) {
  const { materials, nodes } = useGLTF(modalUrl)
  const ball1 = useRef<Group>(null!)
  const ball2 = useRef<Group>(null!)
  const ball3 = useRef<Group>(null!)
  const group = useRef<Group>(null!)

  useEffect(() => {
    const boxMaterial = materials.Box as MeshPhysicalMaterial
    boxMaterial.roughness = 0.3
  }, [materials])

  useGSAP(
    () => {
      if (!show) return
      const startY = 2
      const translate = { y: startY }
      const b1p = ball1.current.position
      const b2p = ball2.current.position
      const b3p = ball3.current.position
      const delay = 0
      const duration = 0.8

      // Animate in
      gsap.fromTo(
        translate,
        { y: startY },
        {
          duration,
          delay: delay + 0.1,
          y: b1p.y + 0.1,
          ease: 'elastic.out(1.0, 0.9)',
          onUpdate: () => {
            ball1.current.position.set(b1p.x, translate.y, b1p.z)
          },
        },
      )

      gsap.fromTo(
        translate,
        { y: startY },
        {
          duration,
          delay: delay + 0.2,
          y: b2p.y + 0.1,
          ease: 'elastic.out(1.0, 0.8)',
          onUpdate: () => {
            ball2.current.position.set(b2p.x, translate.y, b2p.z)
          },
        },
      )

      gsap.fromTo(
        translate,
        { y: startY },
        {
          duration,
          delay: delay + 0.4,
          y: b3p.y + 0.1,
          ease: 'elastic.out(1.0, 0.8)',
          onUpdate: () => {
            ball3.current.position.set(b3p.x, translate.y, b3p.z)
          },
        },
      )
    },
    { scope: group, dependencies: [show] },
  )

  return (
    <group ref={ref} visible={show}>
      <group ref={group} parent={nodes.scene}>
        <primitive ref={ball1} object={nodes.Ball1} dispose={null} />
        <primitive ref={ball2} object={nodes.Ball2} dispose={null} />
        <primitive ref={ball3} object={nodes.Ball3} dispose={null} />
      </group>
    </group>
  )
})

useGLTF.preload(modalUrl)

export default Model3dBalls
