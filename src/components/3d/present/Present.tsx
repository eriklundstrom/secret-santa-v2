import Model3dText from '@components/3d/text/Text.tsx'
import { useGSAP } from '@gsap/react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { deg2rad } from '@utils/deg2rad.ts'
import { Names, NamesLiteral } from '@utils/names.ts'
import gsap from 'gsap'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { Group, MathUtils, MeshPhysicalMaterial } from 'three'
import modalUrl from './paket.glb'

type Props = {
  show: boolean
}

const Model3dPresent = forwardRef<Group, Props>(function Model3dPresent(
  { show },
  ref,
) {
  const wrapper = useRef<Group>(null!)
  const modelWrapper = useRef<Group>(null!)
  const inner = useRef<Group>(null!)
  const text = useRef<Group>(null!)
  const { scene, animations, materials } = useGLTF(modalUrl)
  const {
    ref: animRef,
    actions,
    names,
    mixer,
  } = useAnimations(animations, wrapper)
  const [scale, setScale] = useState(1)
  const [animationStarted, setAnimationStarted] = useState(false)
  const [selectedName, setSelectedName] = useState<NamesLiteral>('Erik')

  useFrame(() => {
    const scaleVal = MathUtils.lerp(inner.current.scale.x, scale, 0.1)
    inner.current.scale.set(scaleVal, scaleVal, scaleVal)
  })

  useEffect(() => {
    const ribbonMaterial = materials.Ribbon as MeshPhysicalMaterial
    ribbonMaterial.roughness = 0.4

    const boxMaterial = materials.Box as MeshPhysicalMaterial
    boxMaterial.roughness = 0.6
  }, [materials])

  // Animate in
  useGSAP(
    () => {
      if (!show) return
      mixer.stopAllAction()
      const delay = 1

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
        delay,
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
        delay,
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
      gsap.fromTo(
        translate,
        {
          x: 0,
          y: -3,
          z: 0,
          rotationX: 0,
          rotationY: deg2rad(360),
          rotationZ: 0,
        },
        {
          duration: 2,
          delay,
          y: -0.2,
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
        },
      )
    },
    { scope: wrapper, dependencies: [show] },
  )

  const { contextSafe } = useGSAP({ scope: wrapper })

  const onClick = contextSafe(() => {
    if (animationStarted) return
    setScale(1)
    setAnimationStarted(() => true)
    document.body.classList.remove('hovered')

    // Get random name
    setSelectedName(Names[(Names.length * Math.random()) | 0] as NamesLiteral)

    const target = { x: deg2rad(5), scale: 1 }
    gsap.to(target, {
      x: deg2rad(-5),
      duration: 0.06,
      delay: 0.4,
      yoyo: true,
      repeat: 3,
      ease: 'power2.inOut',
      onUpdate: () => {
        modelWrapper.current.rotation.set(
          target.x,
          modelWrapper.current.rotation.y,
          target.x,
        )
      },
      onComplete: () => {
        modelWrapper.current.rotation.set(0, modelWrapper.current.rotation.y, 0)
      },
    })

    gsap.to(target, {
      scale: 0.8,
      duration: 0.3,
      ease: 'power1.out',
      onUpdate: () => {
        modelWrapper.current.scale.set(target.scale, target.scale, target.scale)
      },
    })

    gsap.to(target, {
      scale: 1.2,
      duration: 0.8,
      delay: 0.6,
      ease: 'elastic.out',
      onUpdate: () => {
        modelWrapper.current.scale.set(target.scale, target.scale, target.scale)
      },
    })

    setTimeout(() => {
      actions[names[0]]?.reset().play()
      actions[names[0]]!.repetitions = 0
      actions[names[0]]!.timeScale = 1.2
      actions[names[0]]!.clampWhenFinished = true
    }, 650)
  })

  return (
    <group ref={ref} visible={show}>
      <group ref={wrapper} onClick={onClick}>
        <group
          ref={inner}
          onPointerEnter={() => {
            if (animationStarted) return
            setScale(1.1)
            document.body.classList.add('hovered')
          }}
          onPointerLeave={() => {
            if (animationStarted) return
            setScale(1)
            document.body.classList.remove('hovered')
          }}
        >
          <Model3dText ref={text} name={selectedName} show={animationStarted} />
          <group ref={modelWrapper}>
            <primitive group={animRef} object={scene} dispose={null} />
          </group>
        </group>
      </group>
    </group>
  )
})

useGLTF.preload(modalUrl)

export default Model3dPresent
