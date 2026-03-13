const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({limit:"50mb"}));


/* DATABASE CONNECTION */

const db = mysql.createConnection({
host:"localhost",
user:"root",
password:"root@123",
database:"samskriti_billing"
});

db.connect(err=>{
if(err){
console.log("Database Error:",err);
}
else{
console.log("Database Connected");
}
});


/* ------------------------------------------------ */
/* SAVE BILL */
/* ------------------------------------------------ */

app.post("/saveBill",(req,res)=>{

const bill=req.body;

db.query(
"INSERT INTO bills (bill_no,bill_date,customer_name,phone,total,advance_amount,balance_amount,image) VALUES (?,?,?,?,?,?,?,?)",
[
bill.bill_no,
bill.bill_date,
bill.customer_name,
bill.phone,
bill.total,
bill.advance,
bill.balance,
bill.image
],
(err)=>{

if(err){
console.log(err);
return res.json(err);
}

/* SAVE ITEMS */

bill.items.forEach(item=>{

db.query(
"INSERT INTO bill_items (bill_no,particular,qty,rate,amount) VALUES (?,?,?,?,?)",
[
bill.bill_no,
item.particular,
item.qty,
item.rate,
item.amount
]
);

});

res.json({message:"Bill Saved Successfully"});

});

});


/* ------------------------------------------------ */
/* SEARCH BILL */
/* ------------------------------------------------ */

app.get("/bill/:billno",(req,res)=>{

const billno=req.params.billno;

db.query(
"SELECT * FROM bills WHERE bill_no=?",
[billno],
(err,bill)=>{

if(err){
console.log(err);
return res.json(err);
}

if(bill.length==0){
return res.json(null);
}

db.query(
"SELECT * FROM bill_items WHERE bill_no=?",
[billno],
(err,items)=>{

if(err){
console.log(err);
return res.json(err);
}

bill[0].items=items;

res.json(bill[0]);

});

});

});


/* ------------------------------------------------ */
/* SAVE MEASUREMENT */
/* ------------------------------------------------ */

app.post("/saveMeasurement",(req,res)=>{

const data=req.body;

db.query(
"INSERT INTO measurements (name,phone,salwar,blouse) VALUES (?,?,?,?)",
[
data.name,
data.phone,
JSON.stringify(data.salwar),
JSON.stringify(data.blouse)
],
(err)=>{

if(err){
console.log(err);
return res.json(err);
}

res.json({message:"Measurement Saved"});

});

});


/* ------------------------------------------------ */
/* SEARCH MEASUREMENT */
/* ------------------------------------------------ */

app.get("/searchMeasurement",(req,res)=>{

const type=req.query.type;
const value=req.query.value;

let query="";

if(type==="name"){
query="SELECT * FROM measurements WHERE LOWER(name)=LOWER(?)";
}
else if(type==="phone"){
query="SELECT * FROM measurements WHERE phone=?";
}
else{
return res.json(null);
}

db.query(query,[value],(err,result)=>{

if(err){
console.log(err);
return res.json(err);
}

if(result.length===0){
return res.json(null);
}

const data=result[0];

/* CONVERT JSON */

data.salwar=JSON.parse(data.salwar || "{}");
data.blouse=JSON.parse(data.blouse || "{}");

res.json(data);

});

});


/* ------------------------------------------------ */
/* UPDATE MEASUREMENT */
/* ------------------------------------------------ */

app.post("/updateMeasurement",(req,res)=>{

const data=req.body;

db.query(
"UPDATE measurements SET salwar=?,blouse=? WHERE name=? AND phone=?",
[
JSON.stringify(data.salwar),
JSON.stringify(data.blouse),
data.name,
data.phone
],
(err)=>{

if(err){
console.log(err);
return res.json(err);
}

res.json({message:"Measurement Updated"});

});

});


/* ------------------------------------------------ */
/* START SERVER */
/* ------------------------------------------------ */

app.listen(5000,()=>{
console.log("Server Running on Port 5000");
});