// Import necessary modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Import uuid for unique id generation
const sequelize = require('./connection');

// Read existing notes from the file and parse them
const existingNotes = fs.readFileSync(
  path.join(__dirname, "./db/db.json"),
  "utf8"
);
const parsedNotes = JSON.parse(existingNotes);

// Set up the Express app and define the port
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware to handle form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));

// Route to serve the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Route to get all notes from the API
app.get("/api/notes", (req, res) => {
  const notes = getNotes();
  res.json(notes); // Respond with the notes array
});

// Route to serve the notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Route to handle wildcard routes and serve the homepage
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Function to create a new note
const createNewNote = (body) => {
  const newNote = {
    id: uuidv4(),
    title: body.title,
    text: body.text,
  };

  const parsedNotes = getNotes();

  parsedNotes.push(newNote);

  // Write the updated notes array to the file
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(parsedNotes, null, 2)
  );
  return newNote;
};

// Function to get all notes
const getNotes = () => {
  try {
    // Check if existingNotes is defined
    if (existingNotes) {
      // Check if parsedNotes is an array, otherwise return an empty array
      return Array.isArray(parsedNotes) ? parsedNotes : [];
    }
    // Return an empty array if existingNotes is not defined
    return [];
  } catch (error) {
    console.error("Error reading notes:", error);
    return [];
  }
};

// Route to handle the creation of a new note
app.post("/api/notes", (req, res) => {
  const newNote = createNewNote(req.body);
  res.json(newNote); // Respond with the newly created note
});

// Function to delete a note by ID
const deleteNote = (id) => {
  const parsedNotes = getNotes();
  const index = parsedNotes.findIndex((note) => note.id === id);
  parsedNotes.splice(index, 1);

  // Write the updated notes array to the file
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(parsedNotes, null, 2)
  );
};

app.get("/api/notes/:id", (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// Route to handle the deletion of a note by ID
app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id);
  res.json(true); // Respond with a JSON indicating success
});

// Start the server and listen on the defined port
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}!`));
});
