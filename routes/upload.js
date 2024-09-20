const express = require('express')
const router =  express.Router()
const fileMulter = require('../middleware/file')

router.post('/upload',fileMulter.single('test-file'),(req,res)=>{
    res.json('ok')
})

module.exports = router

