const { response } = require("express")
const express = require("express")

const app = express()

app.get('/',(req,res)=>{
    return res.json({
        message: "Hello World 2"
    })
    return res.send('Hello world!')
})
app.get('/courses', (req,res)=>{
    return res.json([
        "Curso 1",
        "Curso 2",
        "Curso 3"
    ])
})
app.post('/courses', (req,res)=>{
    return res.json([
        "Curso 1",
        "Curso 2",
        "Curso 3",
        "Curso 4"
    ])
})

app.patch('/courses/:id', (req,res)=>{
    return res.json([
        "Curso 1",
        "Curso 2",
        "Curso 3",
        "Curso 4",
        "Curso 7"
    ])
})
// Necessário a linha abaixo para especificar para o express que o que ele irá receber é um json
app.use(express.json())
app.put('/courses/:id', (req,res)=>{
    console.log(req.body)
    return res.json([
        "Curso 1",
        "Curso 2",
        "Curso 3",
        "Curso 4",
        "Curso 14"
    ])
})
app.put('/courses/:id', (req,res)=>{
    const { id } = req.params
    console.log(req.params)
    console.log(id)
    return res.json([
        "Curso 1",
        "Curso 2",
        "Curso 3",
        "Curso 4",
        "Curso 14"
    ])
})
app.delete('/courses/:id', (req,res)=>{
    return res.json([
        "Curso 1",
        "Curso 2",
        "Curso 4",
        "Curso 14"
    ])
})
app.listen(2580)
