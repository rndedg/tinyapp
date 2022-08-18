// Implement generateRandomString function

const generateRandomString = () => {
  const result = Math.random().toString(36).substring(2,7);
  return result;
};


// Setting required functions and port variables

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


// GET Routes

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// POST Routes

// Generate random shortURL and redirect to show results
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(302, `/urls/${shortURL}`);
});

// Add POST route to handle Delete functionality

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  delete urlDatabase[req.body.longURL];
  res.redirect("/urls/");
});

// Add POST route to handle Edit functionality

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.updatedURL;
  res.redirect("/urls");
});


// Add POST route for cookie handling

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// Add POST route to handling Logging out

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});


// Set server to listen

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});