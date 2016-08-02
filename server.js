/**
* @file
* server.js
* Sets up an HTTP server, calls a child process to evaluate Racket code and
* returns evaluated output.
*
* Date: 08/02/2016
*
* Dependencies: Express, Socket.io (Refer to package.json)
*/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const exec = require ('child_process').exec;

/**
* First argument / refers to root directory
* @param req- HTTP request- handled through express
* @param res- HTTP response- handled through express
*/

app.get('/', function (req, res){
   res.sendfile ('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
/**
* Event sent command is emitted by client
* @param msg is the message(Racket code) communicated by client
*/
  socket.on('sent command', function (msg){

     console.log('command: ' +msg);

// Create temporary file "in" to hold code

     exec('echo \"' + msg + '\" > in', (error, stdout, stderr) => {
       if (error){
          console.error ('exec error: ${error}');
          return;
       }
// Call Racket on "in"
//Feedback Appreciated- My exec calls are nested and I reckon that's a bad practice
//Since they are nested, I renamed the error, stdout and stderr called in the child process

       exec('racket -e \'(load "in")\'', (E, OUTP, ERR) => {
          if (error){
             console.error ('exec error: ${error}');
             return;
          }

//Print Racket output on console and returns output to index.html

          console.log(OUTP);
       socket.emit('output', OUTP);
       console.log('socket.emit successful');
     });
  });
  });



/*
 });
  socket.on('disconnect', function(){
    console.log('user disconnected');
});
*/
});
http.listen(3000, function (){
   console.log('listening on *:3000');
});
