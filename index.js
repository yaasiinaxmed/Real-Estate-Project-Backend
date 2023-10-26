import express from 'express'
import server from "./api/server.js";

const port = "3000"

server.use(express.static('public'));

server.get('/', (req, res) => {
  res.sendFile('index.html');
});

server.listen(port, () => console.log(`Server is running at ${port}`))