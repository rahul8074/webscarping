const request= require("request-promise");
const cheerio = require("cheerio");
const express = require('express')
const router = express.Router();

require("./dbConnection")

//Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Williammodel = new Schema({
    trade_date:{
        type:"string",
        required:true
    },
    period :{
        type:"string",
        required:true
    },
    William_R_Indicators :{
        type:"string",
        required:true
    },
     
})

const ModelNew = mongoose.model("William %R Indicators",Williammodel);


//loading function
 

async function main(){
    const result = await request.get("http://www.traderscockpit.com/?pageView=william-r-chart&type=wr&symbol=NIFTY");
    const $ = cheerio.load(result);

   

    $("table[class='greenTable'] >tbody >tr").each((index, element) => {
        if (index === 0) return true;
        const tds = $(element).find("td");

        const Trade_date = $(tds[0]).text();
        const Period = $(tds[1]).text();
        const   William_R_Indicators= $(tds[2]).text();
        

    
         //saving data to dataBase
            const newTable = new ModelNew({
                trade_date:Trade_date,
                period:Period,
                William_R_Indicators:  William_R_Indicators
            });
             
            newTable.save((err,docs)=>{
                if(!err) console.log(`Data Saved Successfully`)
                else console.log("error while saving data")
               
            })
            
       
       
    });
    console.log("data is saving")

   
}

main();


module.exports= router;
