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
  
   
      const existClient = await clientsModel.findOne({email})
      if(existClient){
          return res.json({ message: "client already exist" });
      }
  
      const passwordHash = await bcryptjs.hash(password, 10);
  
      const newClient = new clientsModel({name, email, password: passwordHash, telephone, address, status});
      await newClient.save();


      const verificationCode = crypto.randomBytes(3).toString("hex")
  
      const tokenCode = jsonwebtoken.sign(
        
          {email, verificationCode},
         
          config.JWT.secret,
         
          {expiresIn: "2h"},
      )
        res.cookie("VerificationToken", tokenCode, {maxAge: 2*60*60*1000});

   
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.email_user,
                pass: config.email.email_password
            }
        });

     
        const mailOptions = {
        
            from: config.email.email_user,
           
            to: email,
          
            subject: "Verificación de correo",
           
            text: `Para verificar tu correo, utiliza el siguiente codigo ${verificationCode}\n El codigo vence en dos horas`
        }

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

  registerClientsController.verifyCodeEmail = async (req, res) => {
    const { verificationCode  } = req.body;

    const token = req.cookies.VerificationToken;

    try{
       
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const {email, verificationCode: storedCode} = decoded;

       
        if(verificationCode !== storedCode){
            return res.json({message: "invalid code"})
        }

       
        const client = await clientsModel.findOne({email});
        client.isVerified = true;
        await client.save();
        
        res.json({message: "email verified successfull"})

        
        res.clearCookie("VerificationToken");

    }catch(error){
        res.json({message: "error"});
    }
};
   
  export default registerClientsController;