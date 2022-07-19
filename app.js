const express=require("express");
const bodyParser=require("body-parser");
const request = require("request");
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin-sejal:sejal123@cluster0.9hsgz5a.mongodb.net/basic-bank",{useNewUrlParser: true});
const customerSchema={
  name:String,
  Email:String,
  activeBalance:Number
};
const transactionSchema={
  sender: String,
  receiver: String,
  amount: Number
};
const TransactionList=mongoose.model("TransactionList",transactionSchema);
const CustomerList=mongoose.model("CustomerList",customerSchema);
const customer1= new CustomerList({
  name:"Sejal",
  Email:"sejal@gmail.com",
  activeBalance:5000
});
const customer2=new CustomerList({
  name:"Sonali",
  Email:"sonali@gmail.com",
  activeBalance:5000
});
const customer3=new CustomerList({
  name:"Ankur",
  Email:"ankur@gmail.com",
  activeBalance:5000
});
const customer4=new CustomerList({
  name:"Anki",
  Email:"anki@gmail.com",
  activeBalance:5000
});
const customer5=new CustomerList({
  name:"Sonu",
  Email:"sonu@gmail.com",
  activeBalance:5000
});
const customer6=new CustomerList({
  name:"Shubhi",
  Email:"shubhi@gmail.com",
  activeBalance:5000
});
const customer7=new CustomerList({
  name:"Khushi",
  Email:"khushi@gmail.com",
  activeBalance:5000
});
const customer8=new CustomerList({
  name:"Taru",
  Email:"taru@gmail.com",
  activeBalance:5000
});
const customer9=new CustomerList({
  name:"Ram",
  Email:"ram@gmail.com",
  activeBalance:5000
});
const customer10=new CustomerList({
  name:"Jay",
  Email:"jay@gmail.com",
  activeBalance:5000
});
const app=express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/",function(req,res) {
  CustomerList.find({},function(err,foundlist) {
    if(err) {
      console.log(err);
    }else {
      if(foundlist.length===0) {
        CustomerList.insertMany([customer1,customer2,customer3,customer4,customer5,customer6,customer7,customer8,customer9,customer10],function(err) {
          if(err) {
            console.log(err);
          }else {
            console.log("Successfully saved the customer list");
          }
        });
      }
    }
  });
  res.render("index", {
    success:""
  });
});
app.get("/customers",function(req,res) {
  CustomerList.find({},function(err,list) {
    if(err) {
      console.log(err);
    }else {
    res.render("customers",{
      CustomerList:list,
      success: ""
    });
  }
  })

});
app.post("/transaction",function(req,res) {
  const sender=req.body.senderemail;
  const receiver=req.body.receiveremail;
  const amount=req.body.amount;
  const list=new TransactionList({
    sender: sender,
    receiver: receiver,
    amount: amount
  });
  TransactionList.insertMany(list,function(err) {
    if(err) {
      console.log(err);
    } else{
      console.log("Successfully added record to the Transaction List");
    }
  });
  CustomerList.findOne({Email: sender},function(err,result1){
    if(err) {
      console.log(err);
    }else {
      const x=result1;
      CustomerList.findOne({Email: receiver},function(err,result2) {
        if(err){
          console.log(err);
        }else {
          const y=result2;
          const senders= x.activeBalance - amount;
          const receivers = Number(y.activeBalance) + Number(amount);
          CustomerList.findOneAndUpdate({Email:sender},{activeBalance : senders},function(err,result) {
            if(err) {
              console.log(err);
            }
          });
          CustomerList.findOneAndUpdate({Email: receiver},{activeBalance : receivers},function(err,result) {
            if(err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
  res.render("index", {
    success: "Transaction is successfully completed"
  });
});
app.get("/transactions",function(req,res) {
  TransactionList.find({},function(err,results) {
    if(err) {
      console.log(err);
    }else {
      res.render("transactions", {
        transactionList:results
      });
    }
  })
})
app.listen(process.env.PORT||3000,function() {
  console.log("This is new project");
});
