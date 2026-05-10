import db from "../config/sql.js";

const comment = {
    create: ((data,callback) => {
        const sql = "INSERT INTO comments (task_id,user_id,comment) VALUES (?,?,?)";
        db.query(sql,[data.task_id,data.user_id,data.comment],callback);
    })
}

export default comment;