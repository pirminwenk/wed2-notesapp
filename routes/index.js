const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/', function (req, res, next) {
  noteController.showNotes(req, res);
});

router.get('/detail', function (req, res, next) {
  noteController.addNote(req, res);
});

router.get('/detail/:id', function (req, res, next) {
  noteController.editNote(req, res);
});

router.post('/detail/:id', function (req, res, next) {
    noteController.saveNote(req, res);
});

router.post('/detail', function (req, res, next) {
  noteController.createNote(req, res);
});

module.exports = router;
