import express from "express";
import clientsRoutes from "./src/routes/clients.js";
import employeesRoutes from "./src/routes/employee.js";
import registerEmployeesRoutes from "./src/routes/registerEmployees.js";
import loginRoutes from "./src/routes/login.js";
import cookieParser from "cookie-parser";
import logoutRoutes from "./src/routes/logout.js"
import registerClientsRoutes from "./src/routes/registerClients.js";
import moviesRoutes from "./src/routes/movies.js";
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/clients", clientsRoutes);
app.use("/api/employees", employeesRoutes); 
app.use("/api/registerEmployees", registerEmployeesRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/registerClients", registerClientsRoutes)
app.use("/api/movies", moviesRoutes);
app.use("/api/passwordRecovery", passwordRecoveryRoutes);

export default app;