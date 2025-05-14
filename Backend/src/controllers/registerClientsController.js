import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken" 
import nodemailer from "nodemailer"
import crypto from "crypto"
import clientsModel from "../models/client.js"
import { config } from "../config.js";

const registerClientsController = {};

registerClientsController.register = async (req, res) => {
    const {name, email, password, telephone, address, status  } = req.body;
    try{
  
      //Verifica si existe el cliente
      const existClient = await clientsModel.findOne({email})
      if(existClient){
          return res.json({ message: "client already exist" });
      }
  
      const passwordHash = await bcryptjs.hash(password, 10);
  
      const newClient = new clientsModel({name, email, password: passwordHash, telephone, address, status});
      await newClient.save();

      //Genero un codigo aleatorio
      const verificationCode = crypto.randomBytes(3).toString("hex")
  
      const tokenCode = jsonwebtoken.sign(
          //1- que voy a guardar
          {email, verificationCode},
          //2- clave secreta
          config.JWT.secret,
          //3- cuando expira
          {expiresIn: "2h"},
      )
        res.cookie("VerificationToken", tokenCode, {maxAge: 2*60*60*1000});

        //Enviar correo electronico
        //1. Transportar => quien lo envia
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.email_user,
                pass: config.email.email_password
            }
        });

        //2. MailOptions => Quien lo recibe
        const mailOptions = {
            //quien lo envia?
            from: config.email.email_user,
            //quien lo recibe?
            to: email,
            //Asunto
            subject: "Verificación de correo",
            //Cuerpo del correo electronico
            text: `Para verificar tu correo, utiliza el siguiente codigo ${verificationCode}\n El codigo vence en dos horas`
        }

        //3. Enviar correo
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) return res.json({message: "Error"})
                console.log("Correo enviado" + info.response)
        })
        res.json({message: "client registered. please verify your email whit the code"})
    }
    catch (error) {
       res.json({ message: "error" + error});
    }
  };

  //verificar el codigo
  registerClientsController.verifyCodeEmail = async (req, res) => {
    const { verificationCode  } = req.body;

    const token = req.cookies.VerificationToken;

    try{
        //verificar y decodificar el token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const {email, verificationCode: storedCode} = decoded;

        //comparar el codigo que enviamos al correo con el que el usuario escribe
        if(verificationCode !== storedCode){
            return res.json({message: "invalid code"})
        }

        //cambiamos el estado de "isVerified" a true
        const client = await clientsModel.findOne({email});
        client.isVerified = true;
        await client.save();
        
        res.json({message: "email verified successfull"})

        //quito la cookie con el token
        res.clearCookie("VerificationToken");

    }catch(error){
        res.json({message: "error"});
    }
};
   
  export default registerClientsController;