import { useAnimations, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Group, MathUtils, MeshPhysicalMaterial } from 'three'
import modalUrl from './Present.glb'

function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180
}

const useAnimationFrame = (
  cb: (info: { time: number; delta: number }) => void,
) => {
  const cbRef = useRef<(info: { time: number; delta: number }) => void>()
  const frame = useRef<number>()
  const init = useRef(performance.now())
  const last = useRef(performance.now())

  cbRef.current = cb

  const animate = (now: number) => {
    if (cbRef.current) {
      cbRef.current({
        time: (now - init.current) / 1000,
        delta: (now - last.current) / 1000,
      })
    }
    last.current = now
    frame.current = requestAnimationFrame(animate)
  }

  useLayoutEffect(() => {
    frame.current = requestAnimationFrame(animate)

    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current)
      }
    }
  }, [])
}

function Model3dPresent() {
  const group = useRef<Group>(null!)
  const inner = useRef<Group>(null!)
  const mouse = useRef<Group>(null!)

  const { scene, animations, materials } = useGLTF(modalUrl)
  const { ref, actions, names, mixer } = useAnimations(animations, group)
  const material: MeshPhysicalMaterial =
    materials.Texture as MeshPhysicalMaterial
  material.roughness = 0.5

  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  useAnimationFrame(() => {
    mouse.current.rotation.y = MathUtils.lerp(
      mouse.current.rotation.y,
      deg2rad(mouseOffset.x * 0.25),
      0.1,
    )
  })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = e.offsetX - window.innerWidth / 2
      const y = e.offsetY - window.innerHeight / 2
      const pX = (x / window.innerWidth) * 100
      const pY = (y / window.innerHeight) * 100

      setMouseOffset(() => ({ x: pX, y: pY }))
    }

    window.addEventListener('mousemove', handleMove)

    return () => {
      window.removeEventListener('mousemove', handleMove)
    }
  }, [mouseOffset])

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
  }, [actions, names, mixer])

  return (
    <group
      ref={group}
      onClick={() => {
        console.log('WOW')
        actions[names[0]]?.reset().play()
        actions[names[0]]!.repetitions = 0
        actions[names[0]]!.clampWhenFinished = true
      }}
    >
      <group ref={mouse}>
        <group ref={inner}>
          <primitive group={ref} object={scene} dispose={null} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(modalUrl)

export default Model3dPresent
