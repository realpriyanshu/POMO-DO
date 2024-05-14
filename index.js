const express = require('express');
const app = express();
const path = require('path');
const  fs = require('fs');



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

// app.use(express.static(path.join(__dirname,'public')));  // this line is telling that find all the static files inside this public folder.

app.get('/',(res, resp)=>{

    fs.readdir("./public",(err ,files)=>{  /// only after reading the files the page will be shown thats why we keep app.render into the readdir.
        
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send("Internal Server Error");
        }
        resp.render("index1",{files:files});  //this will create a string array of all the files  in the current folder and send it to index1 page.
    })
   
    
})
// this post is for creating new files or tasks in the folder using fs , after creating the file it will be redirected to home page  
//split(' ') make a array of name of file and then join('') it , so there will be no spaces

app.post('/create',(req,resp)=>{
   fs.writeFile(`./public/${req.body.title.split(' ').join('')}.txt`,req.body.content ,function(err){
    resp.redirect("/");
   });
})



app.post('/delete',(req,resp)=>{
    fs.unlink(`./public/${req.body.filename}`,(err)=>{
        if(err){

        }else{
            console.log("1 file deleted")
            resp.redirect('/')
        }
    })
})



//this page is created for  showing the content of the tasks 

app.get('/inside/:filename',(req,resp)=>{
    fs.readFile(`./public/${req.params.filename}`, "utf8",(err,data)=>{
        resp.render("show",{filename:req.params.filename,content:data})
    })
})

app.get('/edit/:filename.txt',(req,resp)=>{
    resp.render("editTitle", {filename: req.params.filename});
})

app.post('/edited',(req,resp)=>{
    fs.rename(`./public/${req.body.update}.txt`,`./public/${req.body.newTitle}.txt`,(err)=>{
        if(err){
            
           
            console.log(err);

        }else{
            resp.redirect('/');

            console.log("title updated");
        }
    })
})


const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);  // attach your server to socket 

io.on('connection',(socket)=>{
    console.log("connection established");

    socket.on('file-content',(data)=>{ /// if you edited any socket then you have to update or have to tell every socket that this socket is updated by using (io.emit) and if you want to show that (io.emit) on screen then ON that io.emit in html or ejs.
        
        fs.writeFile(`./public/${data.filename}`,data.content,(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("file updated");
                
    io.emit('file-updated', data);   
            }
        })
      
    })
   



})






server.listen(3001 , ()=>{
    console.log("running on port 3001");

});
