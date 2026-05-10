import task from "../db/task.js";
import User from "../db/Users.js";
import activity_log from "../db/activity_log.js";

import jwt from "jsonwebtoken";

export const createTask = (req,res) => {
    const data = {
        project_id: req.body.project_id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        assigned_to: req.body.assigned_to,
        due_date: req.body.due_date,
    }

    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,"secretkey");

    if(decoded.role==="project_manager"){
        task.createTask(data,(err,results)=>{
            if(err){
                return res.status(404).json({
                    message: "Task can't be created...",
                    error: err
                })
            }
            activity_log.create(decoded.id,`Task Created name= ${data.title}`,(err,results)=>{
                if(err){
                    console.log("Log error:",err);
                }
            });
            res.status(200).json({
                message: `Task created...\n assigned to ${data.assigned_to} \n by : ${decoded.name} \n submission last date : ${data.due_date}`
            })
        })
    }
    else{
        return res.status(404).json({
            message: `No access for ${decoded.role}`
        })
    }
}

export const deleteTask = (req,res) => {

    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,"secretkey");

    if(decoded.role==="project_manager"){
        const id= req.params.id;
        task.deleteTask(id,(err,results)=>{
            if(err){
                return res.status(400).json({
                    message: "Error deleting the task"
                });
            }
            if(results.affectedRows === 0){
                res.status(404).json({
                    message: "Data not exists!!!"
                });
            }
            activity_log.create(decoded.id,`Task Deleted id= ${id}`,(err,results)=>{
                if(err){
                    console.log("Log error:",err);
                }
            });
            res.status(200).json({
                message: "Deleted Successfully..."
            });
        })
    }
    else{
        res.status(403).json({
            message: `You dont have right as you are ${decoded.role}`
        });
    }
}

export const updateTask = (req,res) => {
    const id= req.params.id;

    const data = {
        status: req.body.status,
        assigned_to: req.body.assigned_to,
        due_date: req.body.due_date
    }

    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,"secretkey");

    User.find(data.assigned_to, (err,person) => {

        if(err) {
            res.status(404).json({
                message: "Error finding the person to whom the task is assigned to!!!"
            })
        }
    
        if(decoded.role === "project_manager" || decoded.name == person[0].name ){
            
            task.updateTask( data, id, (err,result) => {
                if(!data){
                    return res.status(404).json({
                        message: "Enter the updating data!!!"
                    })
                }

                if(err){
                    return res.status(404).json({
                        message: "Error updating the task!!!",
                        error: err
                    })
                }
                activity_log.create(decoded.id,`Task Updated id= ${id}`,(err,results)=>{
                    if(err){
                        console.log("Log error:",err);
                    }
                });
                res.status(200).json({
                    message: `Data Updated for ${data.assigned_to} with id = ${person[0].id}`
                })
            })
        }
        else{
            res.status(403).json({
                message: "Access denied!!!"
            })
        }

    });
}

export const find = (req,res) => {
    const id = req.params.id;
    task.find(id, (err,result)=>{
        if(err){
            return res.status(404).json({
                message: "Error fetching the required task!!!"
            });
        }
        if(result.length == 0){
            return res.status(404).json({
                message: "No task found!!!"
            });
        }
        res.status(200).json({
            data: result
        });
    })
}