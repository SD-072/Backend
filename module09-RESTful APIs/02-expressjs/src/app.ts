import express from "express";
import "./db/index.ts";
import User from "./models/User.ts";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/users", async (req, res) => {
  try {
    //   const {
    //     body: { name, email, password },
    //   } = req;
    const { name, email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Bad Request" });

    const user = await User.create({ name, email, password });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    //   const id = req.params.id;
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User Not Found!" });

    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const user = await User.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });
    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User Not Found!" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
