const request= require("request-promise");
const cheerio = require("cheerio");
const express = require('express')
const router = express.Router();

require("./dbConnection")

//Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let model = new Schema({
    trade_date:{
        type:"string",
        required:true
    },
    TenkanSen :{
        type:"string"
    },
    KijunSen :{
        type:"string"
    },
    SenkouSpanA :{
        type:"string",
    },
    SenkouSpanB :{
        type:"string",

    },
})

const ModelNew = mongoose.model("Ichimoku Cloud",model);


//loading function
 

async function main(){
    const result = await request.get("http://www.traderscockpit.com/?pageView=ichimoku-indicator-ichimoku-cloud-chart&type=ichimoku&symbol=NIFTY");
    const $ = cheerio.load(result);

   

    $("table[class='greenTable'] >tbody >tr").each((index, element) => {
        if (index === 0) return true;
        const tds = $(element).find("td");

        const Trade_date = $(tds[0]).text();
        const TenkanSen = $(tds[1]).text();
        const KijunSen= $(tds[2]).text();
        const SenkouSpanA = $(tds[3]).text();
        const SenkouSpanB = $(tds[4]).text();

    
         //saving data to dataBase
            const newTable = new ModelNew({
                trade_date:Trade_date,
                TenkanSen:TenkanSen,
                KijunSen:KijunSen,
                SenkouSpanA:SenkouSpanA,
                SenkouSpanB:SenkouSpanB
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
