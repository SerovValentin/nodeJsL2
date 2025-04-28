const chalk = require("chalk");
const Note = require("./models/Note");

async function addNote(title, owner) {
  await Note.create({ title, owner });

  console.log(chalk.bgGreen("Note added"));
}

async function removeNote(id, owner) {
  const result = await Note.deleteOne({ _id: id, owner });
  if (result.matchedCount === 0) {
    throw new Error("No note to delete");
  }
  console.log(chalk.bgRed("Note removed"));
}

async function getNotes() {
  const notes = await Note.find();
  return notes;
}

async function editNote(id, newTitle, owner) {
  try {
    const result = await Note.updateOne(
      { _id: id, owner },
      { title: newTitle }
    );

    if (result.matchedCount === 0) {
      throw new Error("No note to edit");
    }
    console.log(chalk.bgGreen("Note edited"));
  } catch (error) {
    console.error("EditNote error:", error);
    throw error;
  }
}

module.exports = {
  addNote,
  removeNote,
  getNotes,
  editNote,
};
