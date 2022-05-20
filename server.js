const express = require("express")
const app = express()

app.listen(3000, function (){
    console.log("servern funkar")
})
app.get("/", function(req, res){

    res.send("lalaland")
})