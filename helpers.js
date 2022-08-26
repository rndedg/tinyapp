const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return null;
};

const urlsForUser = (userIdent, database) => {
  let usersUrls = {};
  for (const shortURL in database) {
    if (database[shortURL].userID === userIdent.id) {
      usersUrls[shortURL] = database[shortURL];
    }
  }
  return usersUrls;
  
};

const generateRandomString = () => {
  const result = Math.random().toString(36).substring(2,7);
  return result;
};

module.exports = { getUserByEmail, urlsForUser, generateRandomString };