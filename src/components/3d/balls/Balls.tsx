import { useGLTF } from '@react-three/drei'
import modalUrl from './balls.glb'

function Model3dBalls() {
  const { scene } = useGLTF(modalUrl)
  return <primitive object={scene} dispose={null} />
}

useGLTF.preload(modalUrl)

export default Model3dBalls
