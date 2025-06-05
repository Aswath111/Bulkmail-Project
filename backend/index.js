const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const app = express();

app.use(express.json())
app.use(cors())

//Install NODEMAILER
const nodemailer = require("nodemailer");

mongoose.connect("mongodb+srv://Aswath:123@cluster0.upuo7z9.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("Conneced to DB")
}).catch(function(){
    console.log("Failed to Connect DB")
})

const credential = mongoose.model("credential",{},"bulkmail")





app.post("/sendemail", function (req, res) {

    var msg = req.body.msg
    var emailList = req.body.emailList

credential.find().then(function(data){

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
    },
});


    new Promise(async function (resolve, reject) {

        try {
            for (var i = 0; i < emailList.length; i++) {
               await  transporter.sendMail(
                    {
                        from: "subramaniaswathkumar@gmail.com",
                        to: emailList[i],
                        subject: "A message from Bulk Mail App",
                        text: msg
                    },

                )

                console.log("Email sent to: " + emailList[i]);
            }

            resolve("Success")
        }
        catch (error) {
            reject("Failed")
        }

    }).then(function(){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })


}).catch(function(error){
    console.log(error)
})




})

app.listen(5001, function () {
    console.log("Server Started.....")
})
