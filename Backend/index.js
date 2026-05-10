import express from "express";
import cors from "cors";

import User from "./routes/user.js";
import project from "./routes/project.js";
import task from "./routes/task.js";
import comment from "./routes/comment.js";
import notification from "./routes/notification.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', User);
app.use('/project', project);
app.use('/task', task);
app.use('/comment', comment);
app.use('/alert', notification);

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend Connected Successfully" });
});

app.listen(3000, () => {
    console.log("Sir chal raha hai!!");
});