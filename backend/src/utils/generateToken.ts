import jwt from 'jsonwebtoken';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;
