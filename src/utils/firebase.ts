import { Names } from '@utils/names.ts'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, runTransaction } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCYhxkdsTFnAqfo8c7J4cqsfFt8BGdlC-k',
  authDomain: 'secret-santa-a3283.firebaseapp.com',
  databaseURL: 'https://secret-santa-a3283.firebaseio.com',
  projectId: 'secret-santa-a3283',
  storageBucket: 'secret-santa-a3283.appspot.com',
  messagingSenderId: '518373367471',
  appId: '1:518373367471:web:e374201d5d76071639fe5a',
}

type Person = {
  index: number
  name: string
  selected: boolean
  santa: string
  prevSanta: string
}

function isAlreadySanta(people: Person[], myName: string) {
  const targets = people.filter((itm) => itm.santa === myName)
  return targets.length > 0
}

function getMySanta(people: Person[], myName: string) {
  const data = people.filter((itm) => itm.name === myName)
  return data[0].santa
}

function filterAvailablePeople(people: Person[], myName: string) {
  const mySanta = getMySanta(people, myName)
  return people.filter(
    (itm) =>
      !itm.selected &&
      itm.name !== myName &&
      itm.prevSanta !== myName &&
      itm.name !== mySanta,
  )
}

export async function getRandomPerson(myName: string, debug: boolean = false) {
  initializeApp(firebaseConfig)

  if (debug) {
    return Names[Math.floor(Math.random() * Names.length)]
  }

  const db = getDatabase()
  const posts = ref(db, '/people')
  let aborted = false
  let isSanta = false

  const result = await runTransaction(posts, (data) => {
    if (!data) return null

    if (isAlreadySanta(data, myName)) {
      isSanta = true
      aborted = true
      return data
    }

    const availablePeople = filterAvailablePeople(data, myName)

    // Check if someone is available
    if (availablePeople.length === 0) {
      aborted = true
      return data
    }

    // Get random person
    const randomIndex = Math.floor(Math.random() * (availablePeople.length - 1))
    const randomPerson = availablePeople[randomIndex]

    // Update data
    data[randomPerson.index].santa = myName
    data[randomPerson.index].selected = true

    return data
  })

  if (isSanta) return 'isSanta'

  if (aborted) return 'error'
  const people: Person[] = result.snapshot.val()
  const myTargets = people.filter((itm) => itm.santa === myName)

  if (myTargets.length === 1) {
    return myTargets[0].name
  } else {
    return 'error'
  }
}
