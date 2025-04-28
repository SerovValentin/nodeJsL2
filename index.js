const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { addUser, loginUser } = require("./users.controller");

const {
  addNote,
  getNotes,
  removeNote,
  editNote,
} = require("./notes.controller");

const auth = require("./middlewares/auth");
const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/register", async (req, res) => {
  return res.render("register", {
    title: "Express App",
    error: undefined,
  });
});

app.get("/login", async (req, res) => {
  return res.render("login", {
    title: "Express App",
    error: undefined,
  });
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  } catch (e) {
    return res.render("login", {
      title: "Expres App",
      error: e.message,
    });
  }
});

app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);
    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      res.render("register", {
        title: "Express App",
        error: "Email is already registered",
      });
      return;
    }
    return res.render("register", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.get("/logout", async (req, res) => {
  res.cookie("token", "", { httpOnly: true });
  res.redirect("/login");
});

app.use(auth);

app.get("/", async (req, res) => {
  return res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    userEmail: req.user.email,
    created: false,
    error: false,
  });
});

app.post("/", async (req, res) => {
  try {
    await addNote(req.body.title, req.user.email);
    return res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (e) {
    console.error("Creation error", e);
    return res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: true,
    });
  }
});

app.put("/:id", async (req, res) => {
  const newTitle = req.body.title;

  if (!newTitle || newTitle.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  try {
    await editNote(req.params.id, newTitle, req.user.email);
    const notes = await getNotes();
    return res.render("index", {
      title: "Express App",
      notes,
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    return res.render("index", {
      title: "Express App",
      notes,
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await removeNote(req.params.id, req.user.email);
    const notes = await getNotes();
    return res.render("index", {
      title: "Express App",
      notes,
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    return res.render("index", {
      title: "Express App",
      notes,
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

mongoose
  .connect(
    "mongodb+srv://Valentin:kristal@cluster0.rknnego.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}...`));
    });
  });
