import { useGSAP } from '@gsap/react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { deg2rad } from '@utils/deg2rad.ts'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Group, MathUtils, MeshPhysicalMaterial } from 'three'
import modalUrl from './paket.glb'

function Model3dPresent() {
  const wrapper = useRef<Group>(null!)
  const inner = useRef<Group>(null!)
  const mouseMovementTarget = useRef<Group>(null!)
  const { scene, animations, materials } = useGLTF(modalUrl)
  const { ref, actions, names, mixer } = useAnimations(animations, wrapper)
  const [scale, setScale] = useState<number>(1)
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

  useFrame(() => {
    mouseMovementTarget.current.rotation.y = MathUtils.lerp(
      mouseMovementTarget.current.rotation.y,
      deg2rad(mouseOffset.x * 0.25),
      0.1,
    )

    const scaleVal = MathUtils.lerp(
      mouseMovementTarget.current.scale.x,
      scale,
      0.1,
    )
    mouseMovementTarget.current.scale.set(scaleVal, scaleVal, scaleVal)
  })

  /*
  useAnimationFrame(() => {
    mouseMovementTarget.current.rotation.y = MathUtils.lerp(
      mouseMovementTarget.current.rotation.y,
      deg2rad(mouseOffset.x * 0.25),
      0.1,
    )

    const scaleVal = MathUtils.lerp(
      mouseMovementTarget.current.scale.x,
      scale,
      0.1,
    )
    mouseMovementTarget.current.scale.set(scaleVal, scaleVal, scaleVal)
  })
   */

  useEffect(() => {
    const ribbonMaterial = materials.Ribbon as MeshPhysicalMaterial
    ribbonMaterial.roughness = 0.4

    const boxMaterial = materials.Box as MeshPhysicalMaterial
    boxMaterial.roughness = 0.6

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [handleMove, materials])

  // Animate in
  useGSAP(
    () => {
      mixer.stopAllAction()

      const translate = {
        x: 0,
        y: -2,
        z: 0,
        rotationX: 0,
        rotationY: deg2rad(360),
        rotationZ: 0,
      }
      const positionOffset = { x: 0, y: 0, z: 0 }
      const rotationOffset = { x: 0, y: 0, z: 0 }

      // Loop - Animate up and down
      gsap.to(positionOffset, {
        duration: 4.0,
        y: -0.05,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        repeatRefresh: true,
        onUpdate: () => {
          inner.current.position.set(0, positionOffset.y, 0)
        },
      })

      // Loop - Animate rotation
      gsap.to(rotationOffset, {
        duration: 6.0,
        x: `random(${deg2rad(5)}, ${deg2rad(-5)})`,
        y: `random(${deg2rad(5)}, ${deg2rad(-5)})`,
        z: `random(${deg2rad(5)}, ${deg2rad(-5)})`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        repeatRefresh: true,
        onUpdate: () => {
          inner.current.rotation.set(
            rotationOffset.x,
            rotationOffset.y,
            rotationOffset.z,
          )
        },
      })

      // Animate in
      gsap.to(translate, {
        duration: 2,
        y: 0,
        rotationY: 0,
        ease: 'elastic.out(1.0, 0.6)',
        onUpdate: () => {
          wrapper.current.position.set(translate.x, translate.y, translate.z)
          wrapper.current.rotation.set(
            translate.rotationX,
            translate.rotationY,
            translate.rotationZ,
          )
        },
      })
    },
    { scope: wrapper },
  )

  return (
    <group
      ref={wrapper}
      onClick={() => {
        actions[names[0]]?.reset().play()
        actions[names[0]]!.repetitions = 0
        actions[names[0]]!.clampWhenFinished = true
      }}
    >
      <group
        ref={mouseMovementTarget}
        onPointerEnter={() => {
          setScale(1.1)
          document.body.classList.add('hovered')
        }}
        onPointerLeave={() => {
          setScale(1)
          document.body.classList.remove('hovered')
        }}
      >
        <group ref={inner}>
          <primitive group={ref} object={scene} dispose={null} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(modalUrl)

export default Model3dPresent
