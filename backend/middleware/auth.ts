import jwt from "jsonwebtoken";

export const auth = async (request: any, reply: any) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Token mancante" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET non definito in .env");

    const decoded: any = jwt.verify(token!, secret);
    (request as any).userId = decoded.id;
  } catch (err) {
    return reply.status(403).send({ message: "Token non valido" });
  }
};
