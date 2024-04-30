import User from "../models/mongo_models/Users.model.js";
import bcrypt from "bcrypt";
import { generateAuthToken } from "../config/auth.js";
import passport from "passport";

const userController = {

    getLogin: async (req, res) => {
        res.render("login");
    },

    login: async (req, res, next) => {
        const { email, password } = req.body;

        try {
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json({ error: "Credenciales inválidas" });
                }
                if (email === "adminCoder@coder.com" && password === "adminCod3er123") {
                    user.role = "admin";
                }

                // Generar token JWT
                const access_token = generateAuthToken(user);

                req.session.userId = user._id;
                req.session.user = user;
                req.session.isAuthenticated = true;

                console.log("Datos del login:", user, "token:", access_token);

                res.cookie("jwtToken", access_token, {
                    httpOnly: true,
                }).send({ status: "Success", message: user, access_token, userId: user._id });
            })(req, res, next);

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getRegister: async (req, res) => {
        res.render("register");
    },

    register: async (req, res, next) => {
        const { first_name, last_name, email, age, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: "El usuario ya existe" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const role = email === "adminCoder@coder.com" ? "admin" : "user";

            const newUser = new User({
                first_name: first_name,
                last_name: last_name,
                email: email,
                age: age,
                password: hashedPassword,
                role,
            });

            await newUser.save();

            const access_token = generateAuthToken(newUser);

            req.session.userId = newUser._id;

            req.session.user = newUser;

            req.session.isAuthenticated = true;

            console.log("Datos del registro:", newUser, "token:", access_token);

            res.cookie("jwtToken", access_token, {
                httpOnly: true,
            }).send({ status: "Success", message: newUser, access_token, userId: newUser._id });

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            next(error);
        }
    },

    getGitHub: passport.authenticate("github", { scope: ["user:email"] }),

    gitHubCallback: passport.authenticate("github", { failureRedirect: "/login" }),

    // Redirige al usuario a la página de inicio después de iniciar sesión con GitHub
    handleGitHubCallback: async (req, res) => {
        const user = req.user;
        try {
            // Genera el token de acceso
            const access_token = generateAuthToken(user);

            // Establece la sesión del usuario
            req.session.userId = user._id;
            req.session.user = user;
            req.session.isAuthenticated = true;

            console.log("Token login github:", access_token);

            // Envia la respuesta con el token de acceso al frontend
            res.cookie("jwtToken", access_token, {
                httpOnly: true,
            }).send({ status: "Success", message: user, access_token, userId: user._id });
        } catch (error) {
            console.error('Error en el callback de GitHub:', error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    logOut: async (req, res) => {
        try {
            req.session.userId = null;
            req.session.user = null;
            req.session.isAuthenticated = false;
            res.clearCookie("jwtToken");
            return res.json({ message: "Logout funciona" });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export default userController;