const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let patients = new Object();
patients["9991935557"] = ["Jeffery", "Smith", "678-999-8212"]
patients["9991935558"] = ["Janett", "Smith", "678-999-8000"]
patients["9991935787"] = ["Caleb", "Smith", "000-000-0000"]

let records = new Object();
records["9991935557"] = "Covid Status: Negative"
records["9991935558"] = "Covid Status: Negative"
records["9991935787"] = "Covid Status: Positive"


//retrive medical records 
app.get("/records",(req,res) =>{


    //Verifying patient exists 
   if(records[req.headers.ssn] === undefined){
    res.status(404).send({"msg": "Unable to local patient information"})
    return;
   };

    //Verifying SSN# matches patient name
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]){
        if (req.body.reasonforvisit === "Covid Test"){
            res.status(200).send(records[req.headers.ssn]);
            return;
        }
        else {
            res.status(501).send({"msg": "Unable to complete request.:" + res.body.reasonforvisit});
            return;
        }
    }
    else{
        res.status(401).send({"msg": "First and Last name doesn't match."})
        return;
    }
});
// Create a new patient in system
app.post("/",(req,res) =>{
    // create patient in database
    patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname , req.headers.phone]
    res.status(200).send(patients)
});


// Update existing patient phone number
app.put("/",(req,res) =>{
    if(records[req.headers.ssn] === undefined){
        res.status(404).send({"msg": "Unable to local patient information"})
        return;
       };

       if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]){
       // Update the phone number and return patient info
       patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.body.phone]
       res.status(200).send(patients[req.headers.ssn]);
       return;

    }
    else{
        res.status(401).send({"msg": "First and Last name doesn't match."})
        return;
    }

    res.status(200).send({"msg": "HTTP PUT: SUCCESS!"})
});

// Delete existing patient from system
app.delete("/",(req,res) =>{ 
    
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]){
        delete patients[req.headers.ssn]
        delete records[req.headers.ssn]
        
        res.status(200).send(patients)
    }
    else{
        res.status(401).send({"msg": "First and Last name doesn't match."})
        return;
    }
});


app.listen(3000);