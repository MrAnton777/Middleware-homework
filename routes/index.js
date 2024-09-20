const express = require('express')
const router =  express.Router()

router.get('/',(req,res)=>{
    let {url,method} = req
    res.json(method)
})

module.exports = router