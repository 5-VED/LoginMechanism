const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Imported routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
dotenv.config();

//Connecting to DB
mongoose.connect(process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true })
    .then(res => console.log('Connected to DataBase'))
    .catch(err => console.log(err))

//Parsing the json 
app.use(express.json());

//Middleware Functions
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

app.listen(3000, () => {
    console.log('Server is spinning at port 3000 ');
});