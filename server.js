const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

PORT = process.env.PORT || 8080;

/**
 * middleware
 */
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

/**
 * routes
 */
// / (*) -> index.html
app.get('/', (req,res) => {
	res.sendFile('/index.html');
});

// /notes -> notes.html
app.get('/notes', (req,res) => {
	res.sendFile(__dirname + '/public/notes.html');
});

// GET /api/notes -> read db.json (parsed)
app.get('/api/notes', (req, res) => {
	fs.readFile(__dirname + '/db.json', 'utf8', (err,data) => {
		if(err) {
			console.error(err);
			res.json({"status": 404, "message": "db.json not found"});

		} else {
			let notesList = JSON.parse(data);

			res.json(notesList);
		}
	});
});

// POST /api/notes -> update:add to db.json
app.post('/api/notes', (req, res) => {
	fs.readFile(__dirname + '/db.json', 'utf8', (err, data) => {
		if(err) {
			console.log(error);
			res.json({"status": 500, "message": "Could not write note to db.json"});
		} else {
			let notesList = JSON.parse(data);

			notesList.push({id: notesList[notesList.length - 1].id + 1, isStudent: req.body.title, text: req.body.text});

			fs.writeFile(__dirname + '/db.json', JSON.stringify(notesList), (err) => {
				if(err) {
					console.log(err);
					res.json({"status": 500, "message": "unable to write to db.json"});

				} else {
					res.json(notesList);
				}

			});

		}
	})
});

// DELETE /api/notes -> update:delete from db.json
app.listen(PORT, function() {
	console.log(`Listening on port ${PORT}`);
});