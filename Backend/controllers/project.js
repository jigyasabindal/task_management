import project from '../db/project.js';
import jwt from "jsonwebtoken";
import activity_log from '../db/activity_log.js';

export const createProject = (req,res) => {
    console.log("CREATE TASK API HIT");
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header missing. Please login first."
        })
    }
    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Invalid Authorization format"
        });
    }
    
    const token = authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message: "Token missing in Authorization header."
        });
    }

    const decoded = jwt.verify(token,"secretkey");


    const project_data = {
        project_name: req.body.name,
        description: req.body.description,
        created_by: decoded.id
    }
    if(decoded.role==="admin"){
        project.find(project_data,(err,results) => {
            if(err) {
                return res.status(101).json({ message: "Error checking project"});
            }
            if (results.length > 0) {
                return res.status(400).json({message: "Project already exists!!!"
                })
            }
        

        project.create(project_data,(err,result)=>{
            if(err) {
                return res.status(500).json({
                    message: "Error creating project",
                    error: err
                });
            }
            activity_log.create(decoded.id,`Project Created name= ${project_data.project_name}`,(err,results)=>{
                if(err){
                    console.log("Log error:",err);
                }
            });
            res.status(201).json({
                message:"Project created successfully",
                projectId: result.insertId
            })
        });
    }
)
    }
    else{
        res.status(404).json({
            message: "Access denied"
        });
    }
}

export const getAllProjects = (req,res) => {
    console.log("DELETE TASK API HIT");
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header missing. Please login first."
        })
    }
    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Invalid Authorization format"
        });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token,"secretkey");

    if ( decoded.role === "admin" ){
        project.getAllProjects((err,results)=>{
            if(err){
                return res.status(500).json({
                        message: "Error fetching project!!!",
                        error: err
                });
            }
            res.status(201).json({
                message:`Successfully fetched... All data is fetched by Admin ${decoded.name}`,
                data: results
            })
        })
    }
    else {
        res.status(404).json({
            message: "Access denied"
        });
    }
}

export const deleteProjects = (req,res) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header missing. Please login first."
        })
    }
    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Invalid Authorization format"
        });
    }
    
    const token = authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message: "Token missing in Authorization header."
        });
    }

    const decoded = jwt.verify(token,"secretkey");
    if (decoded.role==="admin") {
        
        const id=req.params.id;
    // project.findByName(name,(err,results)=>{
        project.find(id,(err,results) => {
            if(err) {
                return res.status(101).json({ message: "Error checking project"});
            }

            project.deleteProject(id, (err,result) => {
                if(err) {
                    return res.status(404).json({
                        message: "Error deleting the project"
                    })
                }
                activity_log.create(decoded.id,`Project Deleted id = ${id}`,(err,results)=>{
                    if(err){
                        console.log("Log error:",err);
                    }
                });
                res.status(200).json({
                    message: "Successfully deleted!!!"
                })
            })
        }
        )
    // })
}
    else {
        return res.status(404).json({
            message: `No access for ${decoded.name}`
        })
    }

}