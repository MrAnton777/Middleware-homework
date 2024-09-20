const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('./middleware/logger')
const indexRouter = require('./routes/index')
const err404  =require('./middleware/err-404')
const uploadRoute = require('./routes/upload')
const router =  express.Router()
const fileMulter = require('./middleware/file')


class Book {
    constructor(title = "", desc = "",authors = "",favourite = "",fileCover = "",fileName = "",fileBook = "",id = uuid(),) {
        this.title = title
        this.desc = desc
        this.authors = authors
        this.favourite = favourite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
        this.id = id
    }
}

const stor = {
    books: [
        new Book('title','desc','ok','ok','ok','ok')
    ],
};



const app = express()
app.use(express.json())
app.use(logger)
app.use('/',indexRouter)
/*app.use('/lib',uploadRoute)*/
app.use('/lib/public',express.static(__dirname+'/public'))

app.get('/lib', (req, res) => {
    const {books} = stor
    res.json(books)
})

app.get('/lib/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.json(books[idx])
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }

})

app.post('/lib/', (req, res) => {
    const {books} = stor
    const {title, desc,authors,favourite,fileCover,fileName} = req.body

    const newBook = new Book(title, desc,authors,favourite,fileCover,fileName)
    books.push(newBook)

    res.status(201)
    res.json(newBook)
})

app.put('/lib/:id', (req, res) => {
    const {books} = stor
    const {title, desc,authors,favourite,fileCover,fileName} = req.body
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1){
        books[idx] = {
            ...books[idx],
            title,
            desc,
            authors,
            favourite,
            fileCover,
            fileName
        }

        res.json(books[idx])
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})

app.delete('/lib/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
     
    if(idx !== -1){
        books.splice(idx, 1)
        res.json('ok')
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})

app.post('/lib/login',(req,res) =>{
    res.status(201)
    res.json({ id: 1, mail: "test@mail.ru" })
})

/*multer*/

app.post('/lib/upload/:id',fileMulter.single('test-file'),(req,res)=>{
    let {books} = stor
    let {id} = req.params
    let {path} = req.file
    const idx = books.findIndex(el => el.id === id)
    if (idx!==-1){
        books[idx].fileBook = path
        res.json('ok')
    }else{res.json('incorrect id | undefined error')}

})

app.get('/lib/:id/download',(req,res)=>{
    let {books} = stor
    let {id} = req.params
    const idx = books.findIndex(el => el.id === id)
    if (idx!==-1){
        express.static(__dirname + books[idx].fileBook)
    }else{res.json('incorrect id | undefined error')}
})



const PORT = process.env.PORT || 3000
app.listen(PORT)

