const router = require('express').Router();
const fs=require('fs');

const {validation_schema_etudiant,validation_schema_module,validation_schema_update_etudiant} = require('../models/student');
const _ = require('lodash');

//ALL STUDENTS MOYENNE ENDPOINT
router.get('/moygeneral', async(req,res) => {
    students=JSON.parse(fs.readFileSync( "./students.json"));
    //checking if there is no student
    if(students.length == 0){
        return res.status(404).send("NO STUDENT FOUND");
    }

    let sum = 0 ;
    students.forEach(et => {
        sum+=parseFloat( et.moyenne);
    });

    let moy = (sum/students.length).toFixed(2);
    console.log(sum)

    return res.status(200).send(JSON.stringify(moy));
});


//MIN MAX NOTE ENDPOINT
router.get('/min_max', async(req, res) => {
    let students = await JSON.parse(fs.readFileSync( "./students.json"));

    //checking if there is no student
    if(students.length == 0){
        return res.status(404).send("NO STUDENT FOUND");
    }

    //we will push the result in this array
    let arraystudents = [];

    // for each student 
    students.forEach(element => {
        let arrayNotes = [];

        //extracting his notes and push it inside array
        element.modules.forEach(mod => {
            arrayNotes.push(mod.note);
        });

        //foreach student assign an object with nom, min, max inside arraystudents
        arraystudents.push({
            nom : element.nom,
            min : Math.min(...arrayNotes),
            max : Math.max(...arrayNotes)
        })
    });
    return res.status(200).send(arraystudents);
});

//ADD ENDPOINT
router.post('/add', async (req,res) => {
    let validation_res =validation_schema_etudiant.validate(req.body);
    //validation from schema
    if(validation_res.error){
        return res.status(400).send(validation_res.error.message);
    }
    let etudiant={
        nom : req.body.nom,
        classe : req.body.classe,
        modules : req.body.modules

    }
    try {

        let sum = 0;
        etudiant.modules.forEach(element => {
            sum += element.note;
        });
        
        etudiant.moyenne = (sum / etudiant.modules.length).toFixed(2);
        let students=JSON.parse(fs.readFileSync( "./students.json"));
        students.push(etudiant);
        fs.writeFileSync("./students.json",JSON.stringify(students));
    } 
    catch (error) {
        return res.status(400).send(error.message);
    }

    res.status(201).send(etudiant);
});

//GET ALL ENDPOINT
router.get('/getall', async (req,res) => {
    let students = await JSON.parse(fs.readFileSync( "./students.json"));
    return res.status(200).send(students);
});

//GET BY ID ENDPOINT
router.get('/get/:nom', async (req, res) => {

    let students = await JSON.parse(fs.readFileSync( "./students.json"));
    let student = students.find(std => std.nom === req.params.nom) 
    //object is null
    if(!student){
        return res.status(404).send("STUDENT NOT FOUND");
    }
    res.status(200).send(student);
});

//DELETE ENDPOINT
router.delete('/delete/:nom', async (req, res) => {
    
    let students = await JSON.parse(fs.readFileSync( "./students.json"));
    let student = students.find(std => std.nom === req.params.nom) 
    //object is null
    if(!student){
        return res.status(404).send("STUDENT NOT FOUND");
    }
    students = students.filter(std => std.nom !== req.params.nom);
    fs.writeFileSync("./students.json",JSON.stringify(students));
    res.status(200).send(student);
});
//Update Student
router.put('/update/:nom',async (req, res) =>{
    let validation_res =validation_schema_update_etudiant.validate(req.body);
    if(validation_res.error){
        return res.status(400).send(validation_res.error.message);
    }
    let students = await JSON.parse(fs.readFileSync( "./students.json"));
    let student = students.find(std => std.nom === req.params.nom)    //object is null
    if(!student){
        return res.status(404).send("STUDENT NOT FOUND");
    }
    if(req.body.nom)
        student.nom =req.body.nom
    if(req.body.classe)
        student.classe=req.body.classe
    if(req.body.modules){
        student.modules=req.body.modules
        try {

            let sum = 0;
            student.modules.forEach(element => {
                sum += element.note;
            });
            
            student.moyenne = (sum / student.modules.length).toFixed(2);
            

            
        } 
        catch (error) {
            return res.status(400).send(error.message);
        }
    }
    fs.writeFileSync("./students.json",JSON.stringify(students));
    res.status(200).send(student);
});
//Update module
router.put('/update/:student/:module',async (req, res) =>{
    let validation_res =validation_schema_module.validate(req.body);
    if(validation_res.error){
        return res.status(400).send(validation_res.error.message);
    }
    let students = await JSON.parse(fs.readFileSync( "./students.json"));
    let student = students.find(std => std.nom === req.params.student)    //object is null
    if(!student){
        return res.status(404).send("STUDENT NOT FOUND");
    }
    let mod=student.modules.find(mod=> mod.module === req.params.module)
    if(!mod)
        return res.status(404).send("Module NOT FOUND");
    mod.module=req.body.module
    mod.note=req.body.note
    try {

        let sum = 0;
        student.modules.forEach(element => {
            sum += element.note;
        });
        
        student.moyenne = (sum / student.modules.length).toFixed(2);
        

        
    } 
    catch (error) {
        return res.status(400).send(error.message);
    }
    fs.writeFileSync("./students.json",JSON.stringify(students));
    res.status(200).send(student);
});
//Add module
router.post('/addModule/:student',async (req, res) =>{
    let validation_res =validation_schema_module.validate(req.body);
    if(validation_res.error){
        return res.status(400).send(validation_res.error.message);
    }
    let students = await JSON.parse(fs.readFileSync( "./students.json"));
    let student = students.find(std => std.nom === req.params.student)    //object is null
    if(!student){
        return res.status(404).send("STUDENT NOT FOUND");
    }
    let mod=student.modules.find(mod=> mod.module === req.body.module)
    if(mod)
        return res.status(404).send("Module Exist");
    let Nvmodule={
        "module": req.body.module,
        "note": req.body.note
    }
   student.modules.push(Nvmodule)
    try {

        let sum = 0;
        student.modules.forEach(element => {
            sum += element.note;
        });
        
        student.moyenne = (sum / student.modules.length).toFixed(2);
        

        
    } 
    catch (error) {
        return res.status(400).send(error.message);
    }
    fs.writeFileSync("./students.json",JSON.stringify(students));
    res.status(200).send(student);
});
//DELETE Module
router.delete('/delete/:student/:module', async (req, res) => {
    
    let students = await JSON.parse(fs.readFileSync( "./students.json"));
    let student = students.find(std => std.nom === req.params.student) 
    //object is null
    if(!student){
        return res.status(404).send("STUDENT NOT FOUND");
    }
    student.modules = student.modules.filter(mod => mod.module !== req.params.module);
    try {

        let sum = 0;
        student.modules.forEach(element => {
            sum += element.note;
        });
        
        student.moyenne = (sum / student.modules.length).toFixed(2);
        

        
    } 
    catch (error) {
        return res.status(400).send(error.message);
    }
    fs.writeFileSync("./students.json",JSON.stringify(students));
    res.status(200).send(student);
});
module.exports = router;