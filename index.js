const express = require('express');
const app = express();
const nodemon = require('nodemon');
app.use(express.json());

//MongoDB Package
const mongoose = require('mongoose');

const PORT = 1200;

const dbUrl = "mongodb+srv://admin:Password7@cluster0.yfajg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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

//gets all students
app.get('/getAllStudents', async(req,res)=>{
    try{
        let students = await Student.find({}).lean();
        return res.status(200).json(students);
    }catch{
        res.status(500).json('{message: Could not find students}');
    }
    
    
});

//gets all courses
app.get('/getAllCourses', async(req,res)=>{
    try{
        let courses = await Course.find({}).lean();
        return res.status(200).json(courses);
    }catch{
        res.status(500).json('{message: Could not find courses}');
    }
    
    
});

//gets specific student using any unique field such as 'studentID': 100
app.post('/findStudent', async(req,res)=>{
    try{
        let students = await Student.find({studentID: req.body.studentID}).lean();
        return res.status(200).json(students);
    }catch{
        res.status(500).json('{message: Could not find student}');
    }
    
    
});

//gets specific course using any unique field such as 'courseID': 'CMSC2204'
app.post('/findCourse', async(req,res)=>{
    try{
        let courses = await Course.find({courseID: req.body.courseID}).lean();
        return res.status(200).json(courses);
    }catch{
        res.status(500).json('{message: Could not find course}');
    }
    
    
});

//adds a course by requiring all properties needed for a course
app.post('/addCourse', async(req, res)=>{
    try{
        let courses = {
            courseInstructor: req.body.courseInstructor,
            courseCredits: req.body.courseCredits,
            courseID: req.body.courseID,
            courseName: req.body.courseName,
            dateEntered: req.body.dateEntered

        }
    
    await Course(courses).save().then(c =>{
        return res.status(201).json('courses added');
    });
    }catch{
        return res.status(500).json('{message: could not add course}');
    }
});

//adds a student by requiring all properties from a student
app.post('/addStudent', async(req, res)=>{
    try{
        let students = {
            fname: req.body.fname,
            lname: req.body.lname,
            studentID: req.body.studentID,
            dateEntered: req.body.dateEntered

        }
    
    await Student(students).save().then(c =>{
        return res.status(201).json('student added');
    });
    }catch{
        return res.status(500).json('{message: could not add student}');
    }
});

//updates the student's first name
app.post('/editStudentById', async (req, res) =>{
    try {
        students = await Student.updateOne({_id: req.body.id}
        , {
            fname: req.body.fname
        }, {upsert: true});
        if (students)
        {
            res.status(200).json("First name of the selected student updated");
        }
        else {
            res.status(200).json("No student's first name changed");
        }
    }
    catch {
        return res.status(500).json("Failed to update the first name of the specified student");
    }
});

//updates student's first and last name
app.post('/editStudentByFname', async (req, res) =>{
    try {
        students = await Student.updateMany({fname: req.body.fname}
        , {
            fname: req.body.Fname,
            lname: req.body.lname
        }, {upsert: true});
        if (students)
        {
            res.status(200).json("Last name of the selected student updated");
        }
        else {
            res.status(200).json("No student's Last name changed");
        }
    }
    catch {
        return res.status(500).json("Failed to update the first name of the specified student");
    }
});

//updates the name of the course instructor
app.post('/editCourseByCourseName', async (req, res) =>{
    try {
        courses = await Course.updateOne({courseName: req.body.courseName}
        , {
            courseInstructor: req.body.courseInstructor
        }, {upsert: true});
        if (courses)
        {
            res.status(200).json("Name of the selected instructor updated");
        }
        else {
            res.status(200).json("No instructor's name changed");
        }
    }
    catch {
        return res.status(500).json("Failed to update the name of the specified instructor");
    }
});

//deletes the record of the student
app.post('/deleteStudentByFname', async (req, res) =>{
    try {
        let students = await Student.findOne({fname: req.body.fname});

        if (students)
        {
            await Student.deleteOne({fname: req.body.fname});
            return res.status(200).json("The record with this first name has been deleted");
        }
        else {
            res.status(200).json("No object found");
        }
    }
    catch {
        return res.status(500).json("Failed to update the name of the specified instructor");
    }
});

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
})