const clientsController = {};
import clientsModel from "../models/Clients.js";


clientsController.getClients = async (req, res) => {
  const clients = await productsModel.find();
  res.json(clients);
};


clientsController.insertClients = async (req, res) => {
  const { name, email, password, telephone, address, status } = req.body;
  const newClient = new clientsModel({ name, email, password, telephone, address, status });
  await newClient.save();
  res.json({ message: "client saved" });
};


clientsController.deleteClients = async (req, res) => {
  await clientsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "client deleted" });
};


clientsController.updateClients = async (req, res) => {
  const { name, email, password, telephone, address, status  } = req.body;
  const updateClient = await clientsModel.findByIdAndUpdate(req.params.id,{  name, email, password, telephone, address, status  }, { new: true });

  if(!updateClient){
    res.json({ message: "client not found" });
  }else {
    res.json({ message: "client updated" });
  }
};

export default clientsController;