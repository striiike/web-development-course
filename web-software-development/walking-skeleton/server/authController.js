import * as jwt from "@hono/hono/jwt";
import { hash, verify } from "scrypt";
import * as authRepository from "./authRepository.js";

const JWT_SECRET = "jwt_secret";

const register = async (c) => {
  const user = await c.req.json();
  user.password_hash = hash(user.password);
  const newUser = await authRepository.create(user);
  return c.json(newUser);
};

const login = async (c) => {
  const user = await c.req.json();

  const foundUser = await authRepository.findByEmail(user.email);
  if (!foundUser) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const isValid = verify(user.password, foundUser.password_hash);
  if (!isValid) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const roles = await authRepository.getUserRoles(foundUser.id);
  const payload = { id: foundUser.id, email: foundUser.email, roles: roles };
  const token = await jwt.sign(payload, JWT_SECRET);

  return c.json({
    message: `Welcome back ${foundUser.email}!`,
    user: { id: foundUser.id, email: foundUser.email, roles: roles },
    token,
  });
};
export { login, register };