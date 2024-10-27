const express = require('express');
const app = require('./app');

const port = 3000;
app.listen(port, () => {
  console.log(`Our App is running in the port ${port}.`);
});
