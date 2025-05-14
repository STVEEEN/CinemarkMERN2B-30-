import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import clientsModel from "../models/client.js";
import employeeModel from "../models/employee.js";
import { sendMail, HTMLRecoveryEmail } from "../utils/MailPasswordRecovery.js";
import { config } from "../config.js";


// 1- Crear un array de funciones
const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    let userFound;
    let userType;

    userFound = await clientsModel.findOne({ email });
    if (userFound) {
      userType = "client";
    } else {
      userFound = await employeeModel.findOne({ email });
      userType = "employee";
    }

    if (!userFound) {
      return res.json({ message: "User not found" });
    }

    // Generar un código de 5 digitos
    const code = Math.floor(10000 + Math.random() * 60000).toString();

    // generar un token
    const token = jsonwebtoken.sign(
      //1-¿qué voy a guardar?
      { email, code, userType, verfied: false },
      //2- secret key
      config.JWT.secret,
      //3- ¿Cúando expira?
      { expiresIn: "25m" }
    );

    res.cookie("tokenRecoveryCode", token, { maxAge: 25 * 60 * 1000 });

    // Enviamos el correo
    await sendEmail(
      email,
      "Password recovery Code",
      `your verification code is ${code}`,
      HTMLRecoveryEmail(code)
    );

    res.json({ message: "Verification code send" });
  } catch (error) {
    console.log("error" + error);
  }
};

///////////////// VERIFICAR EL CODIGO DEL CORREO QUE ME ENVIARON POR CORREO /////////////////
passwordRecoveryController.verifyCode = async (req, res) => {
  const {code} = req.body;

  try{
    //Obtener el token que esta guardado en las cookies
    const token = req.cookies.tokenRecoveryCode;

    //Extraer todos los datos del token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    //Comparar codigo que esta guardado en el token
    // con el codigo que el usuario escribio
    if(decoded.code !== code){
        return res.json({message: "Invalid code"})
    }

    //marcamos el token como verificado (si es correcto)
    const newToken = jsonwebtoken.sign(
      //1- que voy a guardar
      { email: decoded.email,
        code: decoded.code,
        userType: decoded.userType,
        verified: true
      },
      //2- clave secreta
      config.JWT.secret,
      //3- cuando expira
      {expiresIn: "25m"},
    )

    res.cookie("tokenRecoveryCode", newToken, {maxAge:25*60*1000});

    res.json ({message: "code verified sucessfuly"});

  } catch(error){
    console.log("error", error);
  }
};

passwordRecoveryController.newPassword = async(req, res) => {
 const { newPassword } = req.body;

 try{
  //acceder al token que esta en las cookies
  const token = req.cookies.tokenRecoveryCode

  //decodificar el token
  const decoded = jsonwebtoken.verify(token, config.JWT.secret)

  //verificar si el codigo ya fue verificado

  if (!decoded.verified) {
    return res.json({message: "code not verified"})
  }

  let user;


  const {email} = decoded

  //Encriptar la contraseña
  const hashedPassword = await bcryptjs.hash(newPassword, 10)

  //guardamos la contraseña en base de datos
  if( decoded.userType == "client"){
    user = await clientsModel.findOneAndUpdate(
      {email},
      {password: hashedPassword},
      {new: true}
    )
  } else if ( decoded.userType == "employee"){
    user = await clientsModel.findOneAndUpdate(
      {email},
      {password: hashedPassword},
      {new: true}
    )
  }

  res.clearCookie("tokenRecoveryCode")

  res.json({message: "password update"})

 }catch (error) {
  console.log("error" + error);
 }
};

export default passwordRecoveryController;