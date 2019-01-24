const express= require('express');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const db=require('./config/keys').MongoURI;
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');

// Passport config
require('./config/passport')(passport);

// Connect to mongo
mongoose.connect(db,{useNewUrlParser:true})
    .then(()=>console.log('MongoDB connected'))
    .catch(err=>console.log(err))

// EJS
app.use(expressLayouts);
app.set('view engine','ejs');

// Body-Parser
app.use(express.urlencoded({
    extended:false
}));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Global variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});


// Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


// Port
const PORT=process.env.PORT||5000;

// Listening on port
app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`)
})