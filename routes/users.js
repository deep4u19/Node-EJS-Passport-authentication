const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const passport=require('passport');

//Login Page 
router.get('/login',(req,res)=>{
    res.render('login');
});

router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',(req,res)=>{
    const {name,email,password,password2}=req.body;
    let errors=[];
    if(!name||!email||!password||!password2){
        errors.push({
            msg:'Please fill in every field'
        });
    }
    if(password!==password2){
        errors.push({
            msg:"Passwords don't match"
        });
    }
    if(password.length<6){
        errors.push({
            msg:'Password must at least be 6 characters'
        });
    }
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        User.findOne({email:email})
            .then(user=>{
                if(user){
                    errors.push({msg:'Email is already registered'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })          
                }else{
                    const newUser=new User({
                      name,
                      email,
                      password  
                    });
                
            // Hashing password
            
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if (err) throw err;
                    newUser.password=hash;

                    newUser.save()
                        .then(user=>{
                            req.flash('success_msg','You are now registered and can login');
                            res.redirect('/users/login');
                        })
                        .catch(err=>console.log(err))
                        
                    })
                })      
            }
        })
    }
    
});

// Login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})


// Logout handle

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Successfully logged out.');
    res.redirect('/users/login');
})

module.exports=router;