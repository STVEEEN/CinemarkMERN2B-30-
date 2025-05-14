const registerEmployeesController = {};
import Employee from "../models/Employees.js";
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { config } from "../config.js";


registerEmployeesController.register = async (req, res) => {
  const { name, email, password, telephone,  address,  hireDate, salary, status} = req.body;
  try{

    const existEmployee = await Employee.findOne({email})
    if(existEmployee){
        return res.json({ message: "employee already exist" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newEmployee = new Employee({name, email, password: passwordHash, telephone,  address,  hireDate, salary, status});
    await newEmployee.save();
    res.json({ message: "employee saved" });

    jsonwebtoken.sign(

        {id: newEmployee._id},

        config.JWT.secret,

        {expiresIn: config.JWT.expiresIn},

        (error, token) => {
            if(error) console.log (error);
            res.cookie("authToken", token);
        }
    );
  }
  catch (error) {
     console.log(error);
     res.json({ message: "error register employee" });
  }
};

export default registerEmployeesController;