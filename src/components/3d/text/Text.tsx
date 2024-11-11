import { useGSAP } from '@gsap/react'
import { useGLTF } from '@react-three/drei'
import { deg2rad } from '@utils/deg2rad.ts'
import { NamesLiteral } from '@utils/names.ts'
import gsap from 'gsap'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { Group, MeshPhysicalMaterial } from 'three'
import modalUrl from './text.glb'

type Props = {
  name?: NamesLiteral
  show: boolean
}

const Model3dText = forwardRef<Group, Props>(function Model3dText(
  { name, show },
  ref,
) {
  const { materials, nodes } = useGLTF(modalUrl)
  const target = useRef<Group>(null!)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const boxMaterial = materials.Text as MeshPhysicalMaterial
    boxMaterial.roughness = 0.3
  }, [materials])

  useEffect(() => {
    if (!name) return
    target.current.scale.set(0, 0, 0)
  }, [name])

  const { contextSafe } = useGSAP({ scope: target })
  const showText = contextSafe(() => {
    const translate = { scale: 0, rotation: deg2rad(360), position: 0 }

    // Animate in
    gsap.fromTo(
      translate,
      { scale: 0 },
      {
        duration: 0.8,
        scale: 1.2,
        delay: 1.0,
        rotation: deg2rad(-55),
        position: 0.5,
        ease: 'elastic.out(1.0, 0.9)',
        onUpdate: () => {
          target.current.scale.set(
            translate.scale,
            translate.scale,
            translate.scale,
          )

          target.current.rotation.set(
            target.current.rotation.x,
            target.current.rotation.y,
            translate.rotation,
          )

          target.current.position.set(
            target.current.position.x,
            translate.position,
            target.current.position.z,
          )
        },
      },
    )
  })

  useEffect(() => {
    if (!hasAnimated && show) {
      setHasAnimated(true)
      showText()
    }
  }, [show, showText, hasAnimated])

  if (!name) {
    return null
  }

  return (
    <group ref={ref} visible={!!name}>
      <primitive ref={target} object={nodes[`${name}-text`]} dispose={null} />
    </group>
  )
})

useGLTF.preload(modalUrl)

export default Model3dText
