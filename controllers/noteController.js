const store = require("../services/noteStore");
const moment = require('moment');
const url = require('url');

function addNote(req, res) {
  let darkMode = (req.cookies.darkMode || 'false') === 'true';
  res.render('detail', {pageTitle: 'Add new Todo', today: moment().format('YYYY-MM-DD'), darkMode: darkMode});
}

function createNote(req, res) {
  let noteData = req.body;
  store.add(noteData.title, noteData.description, noteData.importance, noteData.finishDate, noteData.finishFlag, (error, note) => {
    res.redirect('/');
  });
}

function editNote(req, res) {
  let darkMode = (req.cookies.darkMode || 'false') === 'true';
  store.getOne(req.params.id).then((note, error) => {
    if (error) {
      res.render('detail', {pageTitle: 'No note was found', darkMode: darkMode});
    } else {
      res.render('detail', {pageTitle: 'Edit Todo', note: note, darkMode: darkMode});
    }
  });
}

function saveNote(req, res) {
  let noteData = req.body;
  store.update(req.params.id, noteData.title, noteData.description, noteData.importance, noteData.finishDate, noteData.finishFlag).then((nrOfUpdates, error) => {
    res.redirect('/');
  });
}

function showNotes(req, res) {
  let parsedUrl = url.parse(req.url, true);
  let promise;

  setCookies(res, parsedUrl);
  
  let darkMode = (parsedUrl.query.darkMode || req.cookies.darkMode || 'false') === 'true';
  let orderBy = parsedUrl.query.orderBy || req.cookies.orderBy || 'createDate';
  let sortASC = (parsedUrl.query.sortASC || req.cookies.sortASC || 'true') === 'true';
  let withFinished = (parsedUrl.query.withFinished || req.cookies.withFinished || 'true') === 'true';

  if (orderBy === 'createDate') {
    promise = store.allByCreateDate(withFinished, sortASC);
  } else if (orderBy === 'finishDate') {
    promise = store.allByFinishDate(withFinished, sortASC);
  } else if (orderBy === 'importance') {
    promise = store.allByImportance(withFinished, sortASC);
  }

  promise.then((data) => {
    res.render('index', {pageTitle: 'Notes App', noteList: data, orderBy: orderBy, sortASC: sortASC, withFinished: withFinished, darkMode: darkMode});
  })
}

function setCookies(res, parsedUrl) {
  if(parsedUrl.query.darkMode) {
    res.cookie('darkMode', parsedUrl.query.darkMode);
  }
  if(parsedUrl.query.orderBy) {
    res.cookie('orderBy', parsedUrl.query.orderBy);
  }
  if(parsedUrl.query.sortASC) {
    res.cookie('sortASC', parsedUrl.query.sortASC);
  }
  if(parsedUrl.query.withFinished) {
    res.cookie('withFinished', parsedUrl.query.withFinished);
  }
}

module.exports = {addNote, createNote, editNote, saveNote, showNotes};
