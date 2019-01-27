const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');
const port = 3000|| process.env.PORT;
//for input output and bodyparsing use
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//use public css file
app.use(express.static('public'));


//access index.html
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
});

//connect to mongoose
const mongoose = require('mongoose');
const options = {
    useNewUrlParser:true
};
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise' ,options);


//use api.js routes as router.
const router = require('' +
    './routes/api');
app.use("/api/exercise",router);




//for case middleware not found
app.use((req, res, next) => {
    return next({status: 404, message: 'not found'});
})

//error catcher middleware
app.use((err, req, res, next) => {
   //error variables for use in if and else to issue in response

    res.json({
        message:err.message
    })
})



//have app listen on port
app.listen(port,()=>{
    console.log("Listening...");
})