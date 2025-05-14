import employeesModel from "../models/employee.js";

const employeesController = {};

employeesController.getEmployees = async (req, res) => {
  const employees = await employeesModel.find();
  res.json(employees);
};


employeesController.insertEmployees = async (req, res) => {
  const { name, email, password, telephone,  address,  hireDate, salary, status} = req.body;
  const newEmployee = new employeesModel({name, email, password, telephone,  address,  hireDate, salary, status});
  await newEmployee.save();
  res.json({ message: "employee saved" });
};


employeesController.deleteEmployees = async (req, res) => {
  await employeesModel.findByIdAndDelete(req.params.id);
  res.json({ message: "employee deleted" });
};


employeesController.updateEmployees = async (req, res) => {
  const { name, email, password, telephone,  address,  hireDate, salary, status} = req.body;
  const updateEmployee = await employeesModel.findByIdAndUpdate( req.params.id,{ name, email, password, telephone,  address,  hireDate, salary, status},{ new: true }
  );

  if(!updateEmployee){
    res.json({ message: "employee not found" });
  }else {
    res.json({ message: "employee updated" });
  }
};

export default employeesController;