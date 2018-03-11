const Datastore = require('nedb');
const db = new Datastore({filename: __dirname + '/../data/note.db', autoload: true});

function Note(title, description, importance, finishDate, finishFlag, createDate) {
  this.title = title;
  this.description = description;
  this.importance = importance;
  this.finishDate = finishDate;
  this.finishFlag = finishFlag;
  this.createDate = createDate;
}

function add(title, description, importance, finishDate, finishFlag, callback) {
  let note = new Note(title, description, importance, finishDate, finishFlag === 'on', new Date());
  db.insert(note, function (err, newDoc) {
    if (callback) {
      callback(err, newDoc);
    }
  });
}

function getOne(id) {
  return new Promise((resolve, reject) => {
    db.findOne({_id: id}, (error, note) => {
      if (error) {
        reject(error);
      }
      resolve(note);
    })
  })
}

function update(id, title, description, importance, finishDate, finishFlag) {
  return new Promise ((resolve, reject) => {
    db.update({ _id: id }, { $set: { title: title, description: description, importance: importance,
      finishDate: finishDate, finishFlag: finishFlag === 'on' } }, {}, function (error, nrOfUpdates) {
      if (error) {
        reject(error);
      }
      resolve(nrOfUpdates);
    })
  })
}

function allByFinishDate(withFinished, sortASC) {
  return new Promise((resolve, reject) => {
    db.find(withFinished ? {} : {'finishFlag': false}).sort({finishDate: order(sortASC)}).exec((error, notes) => {
      if (error) {
        reject(error);
      }
      resolve(notes);
    });
  })
}

function allByCreateDate(withFinished, sortASC) {
  return new Promise((resolve, reject) => {
    db.find(withFinished ? {} : {'finishFlag': false}).sort({createDate: order(sortASC)}).exec((error, notes) => {
      if (error) {
        reject(error);
      }
      resolve(notes);
    });
  });
}

function allByImportance(withFinished, sortASC) {
  return new Promise((resolve, reject) => {
    db.find(withFinished ? {} : {'finishFlag': false}).sort({importance: order(sortASC)}).exec((error, notes) => {
      if (error) {
        reject(error);
      }
      resolve(notes);
    });
  });
}

function order(sortASC) {
  return sortASC ? -1 : 1;
}

module.exports = {
  add, getOne, update, allByCreateDate, allByFinishDate, allByImportance
};
