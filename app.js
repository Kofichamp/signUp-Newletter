const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };
   
    const jsonData = JSON.stringify(data);

    const url = "https://us13.api.mailchimp.com/3.0/lists/6cddd00160";
    const options = {
        method: "POST",
        auth: "Kofi:58f48cd99c83d11d9ab519a1d4b8280c-us13"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

    })

    request.write(jsonData);
    request.end();


});


//    We place the "redirect post" at the end of the "app.post" so it can redirect back to the home page
app.post("/failure", function(req, res) {
    res.redirect("/");
})




app.listen(5500, function(){
    console.log("The server is running on port 3000");
})


// api Key
// 58f48cd99c83d11d9ab519a1d4b8280c-us13

// id
// 6cddd00160