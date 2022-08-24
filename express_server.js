// Implement generateRandomString function
const generateRandomString = () => {
  const result = Math.random().toString(36).substring(2,7);
  return result;
};

// Implement userLookup function
const getUserByEmail = (email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
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

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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
  const templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies.user_id] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render("register", templateVars);
});


// Add Login get route
app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render("urls_login", templateVars);
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
  const userLogin = getUserByEmail(req.body.email);

  if (req.body.email.length <= 0 && req.body.password.length <= 0) {
    res.status(400).send("Please enter e-mail and password.");
  } else if (!userLogin) {
    res.status(403).send("E-mail not found.");
  } else if (req.body.password !== userLogin.password) {
    res.status(403).send("Incorrect password.");
  } else {
    res.cookie("user_id", userLogin.id);
    res.redirect("/urls");
  }

});

// Add POST route to handling Logging out
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Add POST route to register new user
app.post("/register", (req, res) => {

  if (!req.body.email.length) {
    res.status(400).send("Error 400. Please enter e-mail");
  } else if (getUserByEmail(req.body.email)) {
    
    res.status(400).send("E-mail already in use!");
  } else {
  
    const userId = generateRandomString();
    users[userId] = {id: userId, email: req.body.email,   password: req.body.password};
    res.cookie("user_id", userId);
    res.redirect("/urls");
  }
});

// Set server to listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


///CLEAN