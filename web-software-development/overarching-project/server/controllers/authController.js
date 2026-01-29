import * as jwt from "@hono/hono/jwt";
import { hash, verify } from "scrypt";
import * as authRepository from "../repositories/authRepository.js";

const JWT_SECRET = "jwt_secret";

const register = async (c) => {
    let email = "unknown";
    try {
        const body = await c.req.json();
        email = body.email || "unknown";
        const { password } = body;

        if (!email || !password) {
            return c.json({ message: `Confirmation email sent to address ${email}.` }, 400);
        }

        const existing = await authRepository.getUserByEmail(email);
        if (!existing) {
            const passwordHash = await hash(password);
            const created = await authRepository.createUser(email, passwordHash);
            if (created) return c.json({ message: `Confirmation email sent to address ${email}.` }, 200);
            // fallthrough to 200 if insert did not return a result (but still return message)
        }

        return c.json({ message: `Confirmation email sent to address ${email}.` }, 200);
    } catch (error) {
        console.error("Registration error:", error);
        return c.json({ message: `Confirmation email sent to address ${email}.` }, 500);
    }
};




const login = async (c) => {
    try {
        const { email, password } = await c.req.json();

        if (!email || !password) {
            return c.json({ message: "Invalid email or password" }, 400);
        }

        const user = await authRepository.getUserByEmail(email);
        if (!user) {
            return c.json({ message: "Invalid email or password" }, 401);
        }

        const isValid = await verify(password, user.password_hash);
        if (!isValid) {
            return c.json({ message: "Invalid email or password", error: "Invalid email or password" }, 401);
        }

        const payload = { id: user.id, email: user.email };
        const token = await jwt.sign(payload, JWT_SECRET);

        return c.json({
            message: "Login successful",
            user: { id: user.id, email: user.email },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return c.json({ message: "Invalid email or password" }, 500);
    }
};

export { login, register };
