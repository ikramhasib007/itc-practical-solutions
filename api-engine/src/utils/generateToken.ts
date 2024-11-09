import jwt from 'jsonwebtoken'

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || '', {
    expiresIn: '30 days',
  })
}

export default generateToken
