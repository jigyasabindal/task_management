import db from "../config/sql.js";

const project = {

    create: (project,callback) => {
        const sql = "INSERT INTO projects (project_name, description, created_by) VALUES (?, ?, ?)";
        db.query(sql, [project.project_name, project.description, project.created_by], callback);
    },
    getAllProjects: (callback) => {
        db.query("SELECT * FROM projects", callback);
    },
    deleteProject: (id, callback) => {
        db.query("DELETE FROM projects WHERE id = ?", [id], callback);
    },
    updateProject: (id,project,callback) =>{
        const sql= "UPDATE projects SET name = ?, description = ?, created_by = ?, created_at = ? where id = ?";
        db.query(sql, [project.name, project.description, id], callback);
    },
    find: (project,callback) => {
        const sql= "SELECT * FROM projects WHERE id = ? ";
        db.query(sql, [project.id], callback);
    },
    findByName: (name,callback) =>{
        const sql= "SELECT * FROM projects WHERE project_name = ? ";
        db.query(sql, [name], callback);
    }

    // callback=>err,results
}

export default project;