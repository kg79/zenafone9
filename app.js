const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static('public'))
app.set('view engine', 'ejs');
const { MongoClient } = require('mongodb');


const uri = "mongodb+srv://swayze:roadHouse@cluster0.sep4g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


app.get('/pivotPage', (req, res) => {
	res.render('pivotPage');
});

app.get('/keyboard', (req, res) => {
	res.render('keyboard');
});

app.get('/touchScreen', (req, res) => {
	res.render('mobile');
});

app.post('/submitScale', (req, res) => {

	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(async err => {
  	const collection = client.db("universe").collection("world");
  		await collection.insertOne({
			'theScale':req.body.theScale,
			'theName':req.body.theName,
			'theCreator':req.body.theCreator,
			'thePassword':req.body.thePassword
		});
  	client.close();
	});

	res.end('hell yeah');

});

app.post('/updateScale', (req, res) => {

	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(async err => {
  	const collection = client.db("universe").collection("world");
	

		let data = await collection.find({'theName':req.body.theName}).toArray();
		
		if (data[0].theCreator === req.body.theCreator && data[0].thePassword === req.body.thePassword) {

			await collection.updateOne({'theName':req.body.theName}, {$set:{'theScale':req.body.theScale}});

				res.end('success')
			} else {
				res.end('failure');
			}

		
  	client.close();
	});


});

app.post('/deleteScale', (req, res) => {

	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(async err => {
  	const collection = client.db("universe").collection("world");
	

		let data = await collection.find({'theName':req.body.theName}).toArray();
		
		if (data[0].theCreator === req.body.theCreator && data[0].thePassword === req.body.thePassword) {

		await collection.deleteOne({'theName':req.body.theName});
			res.end('success')
		} else {
			res.end('failure');
		}

		
  	client.close();
	});


});

app.post('/submitMobileScale', (req, res) => {

	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(async err => {
  	const collection = client.db("universe").collection("mobileScales");
  		await collection.insertOne({
			'theScale':req.body.theScale,
			'theName':req.body.theName,
			'theCreator':req.body.theCreator,
			'thePassword':req.body.thePassword,
		});
  	client.close();
	});

	res.end('hell yeah');

});



app.get('/scales', (req, res) => {
	
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(async err => {
  	const collection = client.db("universe").collection("world");
		let stuff = await collection.find().toArray();
		res.render('scales', {stuff}); 
  	client.close();
	});


});

app.get('/getScales', (req, res) => {
	
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(async err => {
  	const collection = client.db("universe").collection("world");
		let stuff = await collection.find().toArray();
		res.send(stuff) 
  	client.close();
	});


});



app.get('/retrievedScaleKeyboard', (req, res) => {
	res.render('retrievedScaleKeyboard', {'scaleCookie':req.cookies.scaleCookie});
});

app.get('/retrievedScaleMobile', (req, res) => {
	res.render('retrievedScaleTouchScreen', {'scaleCookie':req.cookies.scaleCookie});
});


app.get('/documentation', (req, res) => {
	res.render('documentation');
});



const PORT = process.env.PORT || 8081;

app.listen(PORT, () => console.log(`${PORT}`));

module.exports = app;
