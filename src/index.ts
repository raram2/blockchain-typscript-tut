interface User {
  name: string
  age: number
  gender?: string
}

const introduce = (user: User): void => {
  console.log(
    `Hello, I am ${user.name}(${user.name}, ${user.gender ?? 'private'})`
  )
}

const user = {
  name: 'Haram',
  age: 29,
}

introduce(user)
