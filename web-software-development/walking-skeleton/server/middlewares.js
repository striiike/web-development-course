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
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
};


const requireAnyRole = (...requiredRoles) => {
  return async (c, next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    if (
      !user.roles || !user.roles.some((role) => requiredRoles.includes(role))
    ) {
      return c.json({ error: "Insufficient permissions" }, 403);
    }

    await next();
  };
};

// remember to export the function
export { authenticate, requireAnyRole };