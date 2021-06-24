const request= require("request-promise");
const cheerio = require("cheerio");
const express = require('express')
const router = express.Router();

require("./dbConnection")

//Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MACDmodel = new Schema({
    trade_date:{
        type:"string",
        required:true
    },
    MACD :{
        type:"string",
        required:true
    },
    Exp :{
        type:"string",
        required:true
    },
    macdHistogram :{
        type:"string",
        required:true
    },
    
})

const ModelNew = mongoose.model("MACD indicators",MACDmodel);


//loading function
 

async function main(){
    const result = await request.get("http://www.traderscockpit.com/?pageView=macd-indicator-macd-chart&type=macd&symbol=NIFTY");
    const $ = cheerio.load(result);

   

    $("table[class='greenTable'] >tbody >tr").each((index, element) => {
        if (index === 0) return true;
        const tds = $(element).find("td");

        const Trade_date = $(tds[0]).text();
        const MACD= $(tds[1]).text();
        const Exp = $(tds[2]).text();
        const  macdHistogram = $(tds[3]).text();

    
         //saving data to dataBase
            const newTable = new ModelNew({
                trade_date:Trade_date,
                MACD:MACD,
                Exp:Exp,
                macdHistogram: macdHistogram
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
