const express = require('express');
const app = express();
const nodemon = require('nodemon');
app.use(express.json());

//MongoDB Package
const mongoose = require('mongoose');

const PORT = 1200;

const dbUrl = "mongodb+srv://admin:Passw0rd@cluster0.vpu9l.mongodb.net/G2A4?retryWrites=true&w=majority";

//Connect to MongoDB
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//MongoDB Connection
const db = mongoose.connection;

//Handle DB Error, display connection
db.on('error', () => {
    console.error.bind(console,'connection error: ');
});
db.once('open',() => {
    console.log('MongoDB Connected')
});

require('./Models/Students');
require('./Models/Courses');

const Student = mongoose.model('Student');
const Course = mongoose.model('Course');

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
})