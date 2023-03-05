const express = require('express')
const app = express()
const port = 3000
const fs=require('fs');
const etudiant_router = require('./routers/students');
app.use(express.json());
app.use("/api/etudiants", etudiant_router);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
