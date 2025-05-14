import moviesModel from "../models/Movies.js"
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";
 
//1.Configurar cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret:config.cloudinary.cloudinary_api_secret
});
 
//2. Array de funciones vacio
const  movieController = {}
 
movieController.getAllPosts = async (req, res) =>{
    const posts = await moviesModel.find()
    res.json(posts)
}
 
//3.Subir un post al blog
movieController.createPost = async (req, res)=>{
    try {
        const{title, description, director, gender, year, duration} =  req.body;
        let imageUrl = ""
 
        if (req.file) {
            const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "public",
                allowed_formats: [ "jpg", "png", "jepg"]
            }
        );
        imageUrl = result.secure_url
        }
       
        const newPost = new moviesModel({title, description, director, gender, year, duration, image: imageUrl})
        newPost.save(
 
        res.json({message: "post saved"})
        )
    } catch (error) {
       console.log("error" + error);
    }
};
 
export default movieController;