import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// signing
export function signJWT(payload: object, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}



// verifay
export function verifyJwt(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
