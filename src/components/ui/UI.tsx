import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import styles from './UI.module.css'

type Props = {
  onNameSelect: () => void
}

function UI({ onNameSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: ref })
  const [isHidden, setIsHidden] = useState(false)

  useGSAP(
    () => {
      gsap.to(ref.current, {
        duration: 1.0,
        delay: 0.5,
        opacity: 1,
        ease: 'power1.inOut',
      })
    },
    { scope: ref },
  )

  const onNameClick = contextSafe(() => {
    gsap.to(ref.current, {
      duration: 1.0,
      opacity: 0,
      ease: 'power1.inOut',
      onComplete: () => {
        setIsHidden(true)
        onNameSelect()
      },
    })
  })

  return (
    <div
      ref={ref}
      className={clsx(styles.wrapper, { [styles.hidden]: isHidden })}
    >
      <div className={styles.inner}>
        <div className={clsx(styles.line, styles.top)}></div>
        <h1 className={styles.title}>Välj ditt namn</h1>
        <div className={styles.button} onClick={onNameClick}>
          <div className={styles.buttonInner}></div>
          <div className={styles.name}>Inger</div>
        </div>
        <div className={styles.button} onClick={onNameClick}>
          <div className={styles.buttonInner}></div>
          <div className={styles.name}>Lasse</div>
        </div>
        <div className={styles.button} onClick={onNameClick}>
          <div className={styles.buttonInner}></div>
          <div className={styles.name}>Micke</div>
        </div>
        <div className={styles.button} onClick={onNameClick}>
          <div className={styles.buttonInner}></div>
          <div className={styles.name}>Manisa</div>
        </div>
        <div className={styles.button} onClick={onNameClick}>
          <div className={styles.buttonInner}></div>
          <div className={styles.name}>Erik</div>
        </div>
        <div className={styles.button} onClick={onNameClick}>
          <div className={styles.buttonInner}></div>
          <div className={styles.name}>Lena</div>
        </div>
        <div className={styles.button} onClick={onNameClick}>
          <div className={styles.buttonInner}></div>
          <div className={styles.name}>Robin</div>
        </div>
        <div className={clsx(styles.line, styles.bottom)}></div>
      </div>
    </div>
  )
}

export default UI
