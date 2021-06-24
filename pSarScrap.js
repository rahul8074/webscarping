const request= require("request-promise");
const cheerio = require("cheerio");
const express = require('express')
const router = express.Router();

require("./dbConnection")

//Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let pSarModel = new Schema({
    trade_date:{
        type:"string",
        required:true
    },
    pSar :{
        type:"string",
        required:true
    }
})

const ModelNew = mongoose.model("pSar Trend",pSarModel);


//loading function
 

async function main(){
    const result = await request.get("http://www.traderscockpit.com/?pageView=pSAR-trend-chart&type=psar&symbol=NIFTY");
    const $ = cheerio.load(result);

   

    $("table[class='greenTable'] >tbody >tr").each((index, element) => {
        if (index === 0) return true;
        const tds = $(element).find("td");
        const Trade_date = $(tds[0]).text();
        const pSar = $(tds[1]).text();

    
         //saving data to dataBase
            const newTable = new ModelNew({
                trade_date:Trade_date,
                pSar:pSar
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
