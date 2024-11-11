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
    gsap.to(content.current, {
      duration: 0.4,
      opacity: 0,
      translateY: '20px',
      ease: 'power1.inOut',
      onComplete: () => {
        setIsHidden(false)
        setHasError(false)
        setIsSanta(false)
        setIsLoading(false)
        setHasSelected(false)
        setSelectedName('')

        gsap.to(content.current, {
          duration: 0.4,
          opacity: 1,
          translateY: '0px',
          ease: 'power1.inOut',
        })
      },
    })
  }

  const onNameClick = (name: string) => {
    if (hasSelected) return
    gsap.to(content.current, {
      duration: 0.4,
      opacity: 0,
      translateY: '20px',
      ease: 'power1.inOut',
      onComplete: () => {
        setSelectedName(name)
        setHasSelected(true)

        gsap.to(content.current, {
          duration: 0.4,
          opacity: 1,
          translateY: '0px',
          ease: 'power1.inOut',
        })
      },
    })
  }

  const onNameCancel = () => {
    if (!hasSelected || isLoading) return
    gsap.to(content.current, {
      duration: 0.4,
      opacity: 0,
      translateY: '20px',
      ease: 'power1.inOut',
      onComplete: () => {
        setHasSelected(false)

        gsap.to(content.current, {
          duration: 0.4,
          opacity: 1,
          translateY: '0px',
          ease: 'power1.inOut',
        })
      },
    })
  }

  const onNameConfirm = contextSafe(async (name: string) => {
    if (isLoading) return
    setIsLoading(true)
    const randomPerson = await getRandomPerson(name)
    const randomName =
      randomPerson !== 'error' ? (randomPerson as NamesLiteral) : undefined

    if (randomPerson === 'error') {
      gsap.to(content.current, {
        duration: 0.4,
        opacity: 0,
        translateY: '20px',
        ease: 'power1.inOut',
        onComplete: () => {
          setHasError(true)
          setIsLoading(false)

          gsap.to(content.current, {
            duration: 0.4,
            opacity: 1,
            translateY: '0px',
            ease: 'power1.inOut',
          })
        },
      })
    } else if (randomPerson === 'isSanta') {
      gsap.to(content.current, {
        duration: 0.4,
        opacity: 0,
        translateY: '20px',
        ease: 'power1.inOut',
        onComplete: () => {
          setIsSanta(true)
          setIsLoading(false)

          gsap.to(content.current, {
            duration: 0.4,
            opacity: 1,
            translateY: '0px',
            ease: 'power1.inOut',
          })
        },
      })
    } else {
      gsap.to(ref.current, {
        duration: 1.0,
        opacity: 0,
        ease: 'power1.inOut',
        onComplete: () => {
          setIsHidden(true)
          onNameSelect(randomName)
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
              <div className={styles.name}>Det är jag!</div>
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
            <h1 className={styles.title}>Något underligt hände!</h1>
            <p className={styles.text}>Kontakta Erik för mer info.</p>
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
            <h1 className={styles.title}>Oj...</h1>
            <p className={styles.text}>
              Det var visst någon som hade önskat en julklapp av dig redan!
            </p>
            <p className={styles.text}>Kontakta Erik för mer info.</p>
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
