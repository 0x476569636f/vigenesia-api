import { SignJWT, jwtVerify } from "jose";

interface JWTPayload {
  userId: string;
  [key: string]: unknown;
}

export class AuthService {
  constructor(private readonly jwtSecret: string) {}

  async createToken(payload: JWTPayload): Promise<string> {
    const secret = new TextEncoder().encode(this.jwtSecret);
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2w")
      .sign(secret);
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    const secret = new TextEncoder().encode(this.jwtSecret);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload as JWTPayload;
  }
}
