const request= require("request-promise");
const cheerio = require("cheerio");
const express = require('express')
const router = express.Router();

require("./dbConnection")

//Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ADXmodel = new Schema({
    trade_date:{
        type:"string",
        required:true
    },
    period :{
        type:"string",
        required:true
    },
    Adx :{
        type:"string",
        required:true
    },
    plusDi :{
        type:"string",
        required:true
    },
    minusDi :{
        type:"string",
        required:true
    },
})

const ModelNew = mongoose.model("ADX indicators",ADXmodel);


//loading function
 

async function main(){
    const result = await request.get("http://www.traderscockpit.com/?pageView=adx-indicator-adx-chart&type=adx&symbol=NIFTY");
    const $ = cheerio.load(result);

   

    $("table[class='greenTable'] >tbody >tr").each((index, element) => {
        if (index === 0) return true;
        const tds = $(element).find("td");

        const Trade_date = $(tds[0]).text();
        const Period = $(tds[1]).text();
        const Adx= $(tds[2]).text();
        const plusDi = $(tds[3]).text();
        const minusDi = $(tds[4]).text();

    
         //saving data to dataBase
            const newTable = new ModelNew({
                trade_date:Trade_date,
                period:Period,
                Adx:Adx,
                plusDi:plusDi,
                minusDi:minusDi
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
