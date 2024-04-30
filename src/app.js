import express from "express";
import mongoose from "mongoose";
import http from "http";
import Handlebars from "handlebars";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import __dirname from "./util.js";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import cors from "cors";
import passport from "./config/jwt.js";
import router from "./routes.js";
import auth from "./config/auth.js";
import { MONGO_URL } from "./util.js";

Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

const fileStore = FileStore(session);
const app = express();
const httpServer = http.createServer(app);

// Inicializar Passport
auth.initializePassport();

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

// Middleware para utilizar cookies
app.use(cookieParser());

// Middleware para usar cors
app.use(cors()); 

// Middleware para usar el session para autenticaciones de usuarios
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 15,
    }),
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
}))

// Rutas para productos y carritos
//app.use("/api/products", productRouter);
//app.use("/api/carts", cartRouter);

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("Error de conexión a MongoDB:", err);
});

db.once("open", () => {
    console.log("Conexión a MongoDB exitosa");
});

// Middleware adicional para analizar el cuerpo de la solicitud JSON en cartRouter
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

// Middleware de Passport para la autenticación de sesión
app.use(passport.initialize());
app.use(passport.session());

// Middleware para utilizar plantillas html
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", router);

const PORT = 8080;

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log("Servidor conectado!!");
});

// Servidor WebSocket
const io = new Server(httpServer);

io.on('connection', socket => {
    console.log("Nuevo cliente conectado!!");

    socket.on("deleteProduct", (deleteProductId) => {
        console.log("Producto borrado:", deleteProductId);
        io.emit("deleteProduct", deleteProductId);
    });

    socket.on("addProduct", (addProduct) => {
        console.log("Producto agregado:", addProduct);
        io.emit("addProduct", addProduct);
    });

    socket.on("addMessage", (addMessage) => {
        console.log("Mensaje agregado", addMessage);
        io.emit("addMessage", addMessage);
    });

    socket.on("deleteProductCart", (deleteProductCartId) => {
        console.log("Producto eliminado del carrito", deleteProductCartId);
        io.emit("deleteProductCart", deleteProductCartId);
    });

    socket.on("clearCart", (clearCart) => {
        console.log("Carrito vaciado:", clearCart);
        io.emit("clearCart", clearCart);
    });
});







/* const connectMongoDB = async ()=>{
    const stringConnection = ("mongodb+srv://julianDubuisson:<password>@cluster0.gtbwigq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    try {
        await mongoose.connect(stringConnection);
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
}; */