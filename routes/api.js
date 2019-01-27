//import mongoose schema Users and Exercises
const Users = require('../models/users')
const Exercises = require('../models/exercises')


//create new router object
const router = require("express").Router();

///////////////////////////////////////////////////////////////////////////////
//ROUTES
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
//create post event for new user
//handle uniqueness issue and other errors before saving
///////////////////////////////////////////////////////////////////////////////
router.post('/new-user',(req,res,next)=>{
    var newUser = new Users(req.body);
    //save and handle errors
    newUser.save((err,user)=>{
            if(err){
                console.log(err.code);
                    //duplicate error case
                     if (err.code == 11000){
                    return res.json({

                    status:400,
                    message:'Username already taken. Please choose another'
                })
            }
                // else{
                //     //to next middleware
                //     return next(err)
                // }
            }
            console.log("Save?")
            return res.json({
                username:user.username,
                _id:user._id
            })
    })
});


///////////////////////////////////////////////////////////////////////////////
//create post event for adding user progress
//
///////////////////////////////////////////////////////////////////////////////
router.post('/add',(req,res,next)=>{
    Users.findOne({"_id":req.body.userId}, (err, user) => {
        //if connect error return error and next()

        //if connect but no user return err.code==400 plus message

        if (err){

            return next(err);}
        if (!user) {



            return next({
                status: 400,
                message: 'ID not found in database'
            })
        }
        //set variable userName to queried user.username

        //create exercise
        const exercise = new Exercises(req.body);
        exercise.username = user.username;

        exercise.save((error,savedExercise)=>{
            if(error){
                console.log(user.username)
                return next(error)};
            savedExercise = savedExercise.toObject();
            delete savedExercise.__v;

            savedExercise._id = savedExercise.userId;
            delete savedExercise.userId;
            savedExercise.date = (new Date(savedExercise.date)).toDateString();
            res.json(savedExercise)
        });
    });
});

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
// router.get('/users',(req,res,next)=>{
//     Users.find({},(err,userData)=>{
//
//         if(err) return next(err);
//
//         return res.json(userData);
//     });
// });
// ///////////////////////////////////////////////////////////////////////////////
// //
// //
// ///////////////////////////////////////////////////////////////////////////////
router.get('/user',(req,res,next)=>{
    var query = {username:req.query.username}
    Users.findOne(query,(err,userData)=>{
        console.log(req)
        if(err) return next(err);
        else if(!userData){
            return res.json({"message":"NO User Data"})
        }

        return res.json({"user ID":userData._id});
    });
});
///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.get('/users',(req,res,next)=>{
    Users.find({},(err,userData)=>{

        if(err) return next(err);

        return res.json(userData);
    });
});
///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.get('/exercises',(req,res,next)=>{
    Exercises.find({},(err,userData)=>{

        if(err) return next(err);

        return res.json(userData);
    });
});


///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.get('/exercise',(req,res,next)=>{
    Users.findOne({_id:req.query.userId},(err,user)=>{
        if(err) {console.log("fail");return next(err)};
        if(!user){
            return next({
                status:400,
                message:"User ID unknown"
            })
        }
        //log user to console if user exists for reference
        console.log(user);
        var fromdate = new Date(req.query.from);
        var todate = new Date(req.query.to);
        var limit = req.query.limit;

        Exercises.find({
            userId:req.query.userId,
            date:{
                //less than case
                $lt: todate != 'Invalid Date' ? todate.getTime() : Date.now(),

                //greater than case
                $gt: fromdate != 'Invalid Date' ? fromdate.getTime() : 0
            }})
            .sort('-date')
            .limit(parseInt(limit))
            .exec((err,exercises)=>{
                if(err)  {console.log("fail");return next(err)};

                var exerciseSearchReturn = {
                    userId:req.query.userId,
                    username: user.username,
                    fromdate: fromdate != 'Invalid Date' ? fromdate.toDateString() : undefined,
                    todate: todate != 'Invalid Date' ? todate.toDateString(): undefined,
                    count: exercises.length,
                    log: exercises.map(e=>({
                        description: e.description,
                        duration: e.duration,
                        date: e.date.toDateString()

                }))
                }
                return res.json(exerciseSearchReturn)
            })
    })
})

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////

router.get('/log',(req,res,next)=>{
    // log to console for test
    console.log(req.query.userId);
    //date vars

    var fromdate = new Date(req.query.from);
    var todate = new Date(req.query.to);
    Users.findOne({_id:req.query.userId},(err,user)=>{
        if(err) return next(err);
        if(!user){
            return next({
                status:400,
                message:"User ID unknown"
            })
        }
        //log user to console if user exists for reference
        console.log(user);
        var query= {
            userId:req.query.userId,
            date:{
                //less than case
                $lt: todate != 'Invalid Date' ? todate.getTime() : Date.now(),

                //greater than case
                $gt: fromdate != 'Invalid Date' ? fromdate.getTime() : 0
            }
            ,
            //
             __v:0
            // __id:0
        };
        Exercises.find(query)
        .sort('-date')
        .limit(parseInt(req.query.limit))
            .exec((err,exercises)=>{
                if (err) return next(err);
                console.log(exercises)
                const logReturn = {
                    userId:req.query.userId,
                    username: user.username,
                    fromdate: fromdate != 'Invalid Date' ? fromdate.toDateString() : undefined,
                    todate: todate != 'Invalid Date' ? todate.toDateString(): undefined,
                    count: exercises.length,
                    log: exercises.map(e=>({
                        description: e.description,
                        duration: e.duration,
                        date: e.date.toDateString()
                    })
                    )
                };
                res.json(logReturn)
            })
    })
});

module.exports = router;