import User from "../db/Users.js";
import jwt from "jsonwebtoken";
import activity_log from "../db/activity_log.js";

export const register = (req,res)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header missing. Please login first."
        })
    }
        
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,"secretkey");

    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }
    if(decoded.role === "admin"){
    User.Register(user, (err,result) => {
        if(err) {
            return res.status(500).json({
                message: "Error creating task",
                error: err
            })
        }
        activity_log.create(decoded.id,`User Registered: ${user.name}`,(err,results)=>{
            if(err){
                console.log("Log error:",err);
            }
        });
        return res.status(201).json({
            message: "User registered",
            userid: result.insertId
        });
      
    })
}
else{
    return res.status(201).json({
            message: "Access denied Only admin can register a user!!!",
        });
}
    
}

export const deleteUser = (req,res)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header missing. Please login first."
        })
    }
        
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,"secretkey");


    const id= req.params.id;

    User.deleteUser(id, (err,result) =>{
        if(err){
            return res.status(500).json({
                message: "Error deleting User",
                error: err
            });
        }
        activity_log.create(decoded.id,`User Deleted: ${id}`,(err,results)=>{
            if(err){
                console.log("Log error:",err);
            }
        });
        res.json({
            message: "User deleted successfully"
        });
    })
}

export const updateUser = (req,res) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header missing. Please login first."
        })
    }
        
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,"secretkey");

    const id=req.params.id;
    const user={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };
    User.updateUser(id, user, (err,result) => {
        if(err) {
            return res.status(500).json({
                message: "Error Updating User",
                error: err
            });
        }
        activity_log.create(decoded.id,`User Updated: ${user.name}`,(err,results)=>{
            if(err){
                console.log("Log error:",err);
            }
        });
        res.status(200).json({
            message: "User updated successfully"
        });
    })
}

export const getAllUsers = (req,res) => {
    User.getAllUsers((err,results)=>{
        if(err){
            return res.status(500).json({
                message:"Error fetching the data",
                error:err
            });
        }
        else
        res.status(200).json({
            message: "Users fetched successfully",
            data: results
        });
    })
}

export const login = (req,res) => {
    const user= {
        email: req.body.email,
        password: req.body.password
    };
    
    User.login(user,(err,result)=> {
        const token = jwt.sign(
            { id: result[0].id, name: result[0].name, role: result[0].role },"secretkey",
            { expiresIn: "7d" }
        );
        if(err) {
            return res.status(404).json({
                message: "No User Found! Try Again!!!"
            })
        }
        if(result.length === 0){
            return res.status(404).json({
                message:"No User Found"
            })
        }
        activity_log.create(result[0].id,"User Login",(err,results)=>{
            if(err){
                console.log("Log error:",err);
            }
        });
        res.status(200).json({
            message: "LOGIN SUCCESSFUL",
            name: result[0].name,
            token: token
        })
    })
}

export const find = (req,res) => {
    const id= req.params.id;
    User.find( id, (err,result)=> {
        if(err) {
            res.status(404).json({
                message: "Error finding the user!!!",
                error: err
            })
        }

        if(result.length == 0){
            res.status(404).json({
                message: "User not found!!!"
            });
        }

        res.status(200).json({
            message: "User fetched",
            data: result
        });
    })
}