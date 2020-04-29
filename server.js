const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const path = require('path');

//publicDir = path.join(__dirname,'public');
//app.use(express.static(publicDir))

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(port);
module.exports = app;
