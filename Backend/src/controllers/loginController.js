const loginController = {};
import EmployeesModel from "../models/employee.js";
import clientsModel from "../models/client.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { config } from "../config.js";


loginController.login = async (req, res) => {
  const { email, password} = req.body;
  try{
    //Validamos los 3 posibles niveles
    //1. Admin, 2. Empleado, 3. Cliente
    let userFound;
    let userType;

    //1. Admin
    if(email == config.emailAdmin.email && password == config.emailAdmin.password){
        userType = "Admin";
        userFound = {_id: "Admin"};
    }else{
        //2. Empleado
        userFound = await EmployeesModel.findOne({email});
        userType = "Employee";

        //3. Cliente
        if(!userFound){
            userFound = await clientsModel.findOne({email});
            userType = "Client";
        }
    }
    // por si no encontramos un usuario
    if(!userFound){
        return res.json({message: "user not found"})
    }
    // si no es administrador, validamos la contraseña
    if(userType !== "Admin"){
        const isMatch = bcryptjs.compare(password, userFound.password);
        if(!isMatch){
            return res.json({message: "invalid password"});
        }
    }
    jsonwebtoken.sign(
        //1- que voy a guardar
        {id: userFound._id, userType},
        //2- clave secreta
        config.JWT.secret,
        //3- cuando expira
        {expiresIn: config.JWT.expiresIn},
        //4- funcion flecha
        (error, token) => {
            if(error) console.log (error);
            res.cookie("authToken", token);
            res.json({message: "login sucessful"});
        }
    );
    }
  catch (error) {
     console.log(error);
  }
};

export default loginController;