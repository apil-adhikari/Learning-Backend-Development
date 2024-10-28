const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
console.log(process.env.NODE_ENV);
console.log(app.get('env'));

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Our App is running in the port ${port}.`);
});
