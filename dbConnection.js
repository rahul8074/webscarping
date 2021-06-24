const mongoose = require('mongoose');
 

var mongoDB = 'mongodb://127.0.0.1/webScaraping';
const connectionParams ={
    useNewUrlParser: true,
    useUnifiedTopology : true
}

mongoose.connect(mongoDB,connectionParams)
    .then( () => {
        console.log("Database connection successful")
    })
    .catch( (err) => {
        console.error('Error connecting database'+err)
    })