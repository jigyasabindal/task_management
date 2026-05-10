import db from "../config/sql.js";

const User = {

    Register: (user,callback) => {
        const sql = "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";
        db.query(sql, [user.name,user.email,user.password,user.role], callback);
    },
    getAllUsers: (callback) => {
        db.query("SELECT * FROM users", callback);
    },
    deleteUser: (id, callback) => {
        db.query("DELETE FROM users WHERE id = ?", [id], callback);
    },
    updateUser: (id,user,callback) =>{
        const sql= "UPDATE users SET name = ?, email = ?, password = ?, role = ? where id = ?";
        db.query(sql, [user.name, user.email, user.password, user.role, id], callback);
    },
    login: (user,callback) => {
        const sql= "SELECT * FROM users WHERE email = ? AND password = ?";
        db.query(sql,[user.email,user.password], callback);
    },
    find: (id,callback) => {
        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql,[id],callback);
    }
}

export default User;