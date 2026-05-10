import db from "../config/sql.js";

const activity_log = {
    create: (id,action,callback) => {
        const sql= "INSERT INTO activity_logs (user_id,action) VALUES (?,?)";
        db.query(sql,[id,action],callback);
    }
}

export default activity_log;