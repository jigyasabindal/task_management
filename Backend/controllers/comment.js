import comment from "../db/comment.js";
import task from "../db/task.js";
import activity_log from "../db/activity_log.js";
import jwt from "jsonwebtoken";

export const comments = (req,res) => {
    
    const id = req.params.id;
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
    task.find(id, (err,result) => {
        if(err) {
            res.status(500).json({
                message: "Error fetching task",
                error: err
            });
        }
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        const data = {
            task_id: result[0].id,
            user_id: decoded.id,
            comment: req.body.comment
        }
        comment.create(data, (err,result) => {
            if(err){
                res.status(500).json({
                    message: "Error fetching task",
                    error: err
                });
            }
            activity_log.create(decoded.id,`User Commented on taskId = ${data.task_id}`,(err,results)=>{
                if(err){
                    console.log("Log error:",err);
                }
            });
            res.status(200).json({
                message: "Comment created..."
            });
        })
    })
}