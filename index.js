const express = require('express');
const app = require('express')();
const port = 8080;
const fs = require('fs');

app.use(express.json());

let usersInfo = require('./users.json');

// Get list of users
app.get('/list/users', (req, res) => {
  res.json(usersInfo);
});

//Insert a user
app.post('/insert/users', (req, res) => {
    const newUser = req.body; // Assumes that the request body contains user data
    newUser.id = usersInfo.users.length + 1;
    usersInfo.users.push(newUser);
  
    // Update the users.json file with the new data
    fs.writeFileSync('./users.json', JSON.stringify(usersInfo, null, 2), 'utf-8');
  
    res.status(200).json(newUser);
  });

//Get a single user by ID
app.get('/single/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = usersInfo.users.find((user) => user.id === id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

  //Delete a user by ID
  app.delete('/delete/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = usersInfo.users.findIndex((user) => user.id === id);
    if (userIndex >= 0) {
      const deletedUser = usersInfo.users.splice(userIndex, 1);
  
      // Update the users.json file after deleting
      fs.writeFileSync('./users.json', JSON.stringify(usersInfo, null, 2), 'utf-8');
  
      res.json(deletedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

app.listen(
    port,
    () => console.log(`Server is live on http://localhost:${port}`)
)