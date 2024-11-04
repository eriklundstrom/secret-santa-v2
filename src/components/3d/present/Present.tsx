import { useAnimations, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import modalUrl from './Present.glb'

function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180
}

function Model3dPresent() {
  const group = useRef()
  const inner = useRef()
  const { scene, animations, materials } = useGLTF(modalUrl)
  const { ref, actions, names, mixer } = useAnimations(animations, group)
  materials.Texture.roughness = 0.5

  useEffect(() => {
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

    gsap.to(positionOffset, {
      duration: 4.0,
      y: -0.05,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      onUpdate: () => {
        inner.current.position.set(
          positionOffset.x,
          positionOffset.y,
          positionOffset.z,
        )
      },
      repeatRefresh: true,
    })

    gsap.to(rotationOffset, {
      duration: 6.0,
      x: `random(${deg2rad(5)}, ${deg2rad(-5)})`,
      y: `random(${deg2rad(5)}, ${deg2rad(-5)})`,
      z: `random(${deg2rad(5)}, ${deg2rad(-5)})`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      onUpdate: () => {
        inner.current.rotation.set(
          rotationOffset.x,
          rotationOffset.y,
          rotationOffset.z,
        )
      },
      repeatRefresh: true,
    })

    gsap.to(translate, {
      duration: 2,
      y: 0,
      rotationY: 0,
      //ease: 'back.out(0.1, 0.1)',
      ease: 'elastic.out(1.0, 0.6)',
      onUpdate: () => {
        group.current.position.set(translate.x, translate.y, translate.z)
        group.current.rotation.set(
          translate.rotationX,
          translate.rotationY,
          translate.rotationZ,
        )
      },
    })

    mixer.stopAllAction()
    //
    // actions[names[0]]?.reset().play()
    //actions[names[0]]?.reset().play()
  }, [actions, names])

  return (
    <group ref={group}>
      <group ref={inner}>
        <primitive group={ref} object={scene} dispose={null} />
      </group>
    </group>
  )
}

useGLTF.preload(modalUrl)

export default Model3dPresent
