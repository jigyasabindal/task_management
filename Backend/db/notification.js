import db from "../config/sql.js";

const alerts = {
    create: ( callback ) => {
        const sql= "SELECT * from tasks where status != 'completed' && due_date > NOW()+ INTERVAL 3 DAY"
        db.query(sql, callback);
    }
}

export default alerts;