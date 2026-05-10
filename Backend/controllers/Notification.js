import alerts from "../db/notification.js";

export const create = (req,res) => {
    
    alerts.create((err,result) => {
        if(err) {
            res.status(404).json({
                message: "Error finding notification alerts",
                error: err
            });
        }
        
        res.status(200).json({
            alerts: result
        });
    })


}