import { v4 as uuid } from 'uuid'

type SignInRequestData = {
  email: string;
  password: string;
}

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export async function signInRequest(data: SignInRequestData) {
  await delay()

  return {
    token: uuid(),
    user: {
      name: 'Bruno Santos',
      email: 'brunohdseising@gmail.com',
      avatar_url: 'https://github.com/diego3g.png'
    }
  }
}

export async function recoverUserInformation() {
  await delay()

  return {
    user: {
        name: 'Bruno Santos',
        email: 'brunohdseising@gmail.com',
      avatar_url: 'https://github.com/diego3g.png'
    }
  }
}