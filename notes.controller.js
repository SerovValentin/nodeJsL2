const fs = require("fs/promises");

const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();
  const note = {
    title,
    id: Date.now().toString(),
  };
  notes.push(note);

  await fs.writeFile("./db.json", JSON.stringify(notes));
  console.log(chalk.bgGreen("Note added"));
}

async function removeNote(id) {
  const notes = await getNotes();
  const newNotes = notes.filter((note) => note.id !== id);
  await fs.writeFile(notesPath, JSON.stringify(newNotes));
  console.log(chalk.bgRed("Note removed"));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNotes() {
  const notes = await getNotes();
  console.log(chalk.bgBlue("Here the list of notes:"));
  notes.forEach((note) => {
    console.log(chalk.red(note.id, " ", note.title));
  });
}

async function editNote(id, newTitle) {
  const notes = await getNotes();
  const note = notes.find((note) => note.id === id);
  note.title = newTitle;
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.bgGreen("Note edited"));
}

module.exports = {
  addNote,
  printNotes,
  removeNote,
  getNotes,
  editNote,
};
