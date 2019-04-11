const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
	console.log('socket');
	socket.on('connectRoom', box => socket.join(box));
});

mongoose.connect('mongodb+srv://rocketseat:rocketseat@cluster0-kjbyd.mongodb.net/rocketdrive?retryWrites=true', {
	useNewUrlParser: true,
});

app.use(express.json());
//permite o envio de arquivos
app.use(express.urlencoded({ extended: true }));

//middleware global para o socket
app.use((req, res, next) => {
	req.io = io;

	return next();
});

//permitindo acessar o arquivo pela url
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(routes);

server.listen(process.env.PORT || 3000);
