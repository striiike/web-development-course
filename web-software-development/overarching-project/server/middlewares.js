import * as jwt from "@hono/hono/jwt";

const JWT_SECRET = "jwt_secret";

const authenticate = async (c, next) => {
  try {
    const token = c.req.header("authorization")?.split(" ")[1];
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    const payload = await jwt.verify(token, JWT_SECRET);
    c.set("user", payload);
    await next();
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
};

export { authenticate };
