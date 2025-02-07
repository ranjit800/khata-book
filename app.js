const express  = require ("express");
const app = express();
const path = require("path")
const fs = require ("fs");
const { render, fileLoader } = require("ejs");
const { title } = require("process");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//folder reed
app.get('/', (req,res,next)=>{
    fs.readdir(`./hisab`, function(err,files){
        if (err) return res.status(500).send(err);
        else res.render('index', {files: files});
    })
})

//create page
app.get('/create', (req,res,next)=>{
  res.render('create')
})


//create hisab
app.post('/createhisaab', function(req,res,next){

   var currentDate = new Date();
   var date =`${currentDate.getDate()}-${currentDate.getMonth() +1}-${currentDate.getFullYear()}`

    fs.writeFile(`./hisab/${date}.txt`,
         req.body.content,
         function(err){
        if(err) return res.status(500).send(err);
        res.redirect('/');
    })
})

//Edit hisab
app.get("/edit/:filename", function(req,res,next){
    fs.readFile(`./hisab/${req.params.filename}`,
         "utf-8",
          function(err, filedata){
            if(err) return res.status(500).send(err);
            res.render("edit",{filedata, filename: req.params.filename})

    })
})

//update Hisab
app.post("/update/:filename", function(req,res,next){
   fs.writeFile(`./hisab/${req.params.filename}`, req.body.content, function(err){
    if (err) return res.status(500).send(err);
    res.redirect("/");
   })
})

//show hisab
app.get('/hisab/:filename', function(req,res,next){
    fs.readFile(`./hisab/${req.params.filename}`, "utf-8", 
        function(err, filedata){
            if (err) return res.status(500).send(err);
            res.render('hisab', {filedata, filename:req.params.filename});
    })
})

//delete file
app.get('/delete/:filename', (req,res,next)=>{
    fs.unlink(`./hisab/${req.params.filename}`, function(err){
        if (err) return res.status(500).send(err);
        res.redirect("/")
    })
})


app.listen(3000, ()=>{
    console.log("server running on  port 3000")
})