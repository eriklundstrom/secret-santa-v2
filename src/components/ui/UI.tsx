import { useGSAP } from '@gsap/react'
import { getRandomPerson } from '@utils/firebase.ts'
import { Names, NamesLiteral } from '@utils/names.ts'
import clsx from 'clsx'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import styles from './UI.module.css'

type Props = {
  onNameSelect: (name?: NamesLiteral) => void
}

function UI({ onNameSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: ref })
  const [isHidden, setIsHidden] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isSanta, setIsSanta] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)
  const [selectedName, setSelectedName] = useState<string>('')

  const animateContent = contextSafe((callback: () => void) => {
    gsap.to(content.current, {
      duration: 0.4,
      opacity: 0,
      translateY: '20px',
      ease: 'power1.inOut',
      onComplete: () => {
        callback()

        gsap.to(content.current, {
          duration: 0.4,
          opacity: 1,
          translateY: '0px',
          ease: 'power1.inOut',
        })
      },
    })
  })

  useGSAP(
    () => {
      gsap.fromTo(
        content.current,
        { opacity: 0, translateY: '20px' },
        {
          duration: 0.6,
          delay: 0.5,
          opacity: 1,
          translateY: '0px',
          ease: 'power1.inOut',
        },
      )
    },
    { scope: ref },
  )

  const onBack = () => {
    animateContent(() => {
      setIsHidden(false)
      setHasError(false)
      setIsSanta(false)
      setIsLoading(false)
      setHasSelected(false)
      setSelectedName('')
    })
  }

  const onNameClick = (name: string) => {
    if (hasSelected) return
    animateContent(() => {
      setSelectedName(name)
      setHasSelected(true)
    })
  }

  const onNameCancel = () => {
    if (!hasSelected || isLoading) return
    animateContent(() => {
      setHasSelected(false)
    })
  }

  const onNameConfirm = contextSafe(async (name: string) => {
    if (isLoading) return
    setIsLoading(true)
    const randomPerson = await getRandomPerson(name)
    const randomName =
      randomPerson !== 'error' ? (randomPerson as NamesLiteral) : undefined

    if (randomPerson === 'error') {
      animateContent(() => {
        setHasError(true)
        setIsLoading(false)
      })
    } else if (randomPerson === 'isSanta') {
      animateContent(() => {
        setIsSanta(true)
        setIsLoading(false)
      })
    } else {
      gsap.to(content.current, {
        duration: 0.4,
        opacity: 0,
        translateY: '20px',
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.to(ref.current, {
            duration: 1.0,
            opacity: 0,
            ease: 'power1.inOut',
            onComplete: () => {
              setIsHidden(true)
              onNameSelect(randomName)
            },
          })
        },
      })
    }
  })

  return (
    <div
      ref={ref}
      className={clsx(styles.wrapper, { [styles.hidden]: isHidden })}
    >
      <div ref={content} className={styles.content}>
        {!hasError && !isSanta && !hasSelected && (
          <div className={styles.inner}>
            <div className={clsx(styles.line, styles.top)}></div>
            <h1 className={styles.title}>Välj ditt namn</h1>
            {Names.map((item) => (
              <div
                key={item}
                className={styles.button}
                onClick={() => onNameClick(item)}
              >
                <div className={styles.buttonInner}></div>
                <div className={styles.name}>{item}</div>
              </div>
            ))}
            <div className={clsx(styles.line, styles.bottom)}></div>
          </div>
        )}

        {!hasError && !isSanta && hasSelected && selectedName !== '' && (
          <div className={styles.inner}>
            <div className={clsx(styles.line, styles.top)}></div>
            <h1 className={styles.title}>Välkommen {selectedName}!</h1>
            <div
              className={clsx(styles.button, { [styles.locked]: isLoading })}
              onClick={() => onNameConfirm(selectedName)}
            >
              <div className={styles.buttonInner}></div>
              <div className={styles.name}>Då kör vi!</div>
            </div>
            <div
              className={clsx(styles.button, { [styles.locked]: isLoading })}
              onClick={() => onNameCancel()}
            >
              <div className={styles.buttonInner}></div>
              <div className={styles.name}>Tillbaka</div>
            </div>
            <div className={clsx(styles.line, styles.bottom)}></div>
          </div>
        )}

        {hasError && (
          <div className={styles.inner}>
            <div className={clsx(styles.line, styles.top)}></div>
            <h1 className={clsx(styles.title, styles.small)}>Oj...</h1>
            <p className={styles.text}>Något underligt hände!</p>
            <p className={clsx(styles.text, styles.last)}>
              Kontakta Erik för mer info.
            </p>
            <div className={styles.button} onClick={() => onBack()}>
              <div className={styles.buttonInner}></div>
              <div className={styles.name}>Tillbaka</div>
            </div>
            <div className={clsx(styles.line, styles.bottom)}></div>
          </div>
        )}

        {isSanta && (
          <div className={styles.inner}>
            <div className={clsx(styles.line, styles.top)}></div>
            <h1 className={clsx(styles.title, styles.small)}>Oj...</h1>
            <p className={styles.text}>
              Det var visst någon som hade önskat en julklapp av dig redan!
            </p>
            <p className={clsx(styles.text, styles.last)}>
              Kontakta Erik för mer info.
            </p>
            <div className={styles.button} onClick={() => onBack()}>
              <div className={styles.buttonInner}></div>
              <div className={styles.name}>Tillbaka</div>
            </div>
            <div className={clsx(styles.line, styles.bottom)}></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UI
