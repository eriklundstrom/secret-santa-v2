import { useLayoutEffect, useRef } from 'react'

export function useAnimationFrame(
  cb: (info: { time: number; delta: number }) => void,
) {
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
