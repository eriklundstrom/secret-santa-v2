import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing'

function Effects() {
  return (
    <EffectComposer stencilBuffer>
      <N8AO
        halfRes
        aoSamples={5}
        aoRadius={0.4}
        distanceFalloff={0.75}
        intensity={1}
      />
      <ToneMapping />
    </EffectComposer>
  )
}

export default Effects
