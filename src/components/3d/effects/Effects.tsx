import { EffectComposer, ToneMapping } from '@react-three/postprocessing'

function Effects() {
  /**
   * <N8AO
   *         halfRes
   *         aoSamples={5}
   *         aoRadius={0.4}
   *         distanceFalloff={0.75}
   *         intensity={1}
   *       />
   */

  return (
    <EffectComposer stencilBuffer>
      <ToneMapping />
    </EffectComposer>
  )
}

export default Effects
