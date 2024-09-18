const express = require('express');
const app = express();
app.use(express.static('public'));
app.listen(3001, () => {
    console.log('Frontend server started on port 3001');
});
const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3001, () => {
    console.log('Frontend server started on port 3001');
});