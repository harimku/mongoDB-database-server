const MongoClient = require('mongodb').MongoClient;  //act as a client for the mongo server
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';

//connect to mongodb server
MongoClient.connect(url, { useUnifiedTopology: true }).then(client => {

    console.log('Connected correctly to server');

    const db = client.db(dbname);

    db.dropCollection('campsites')
    .then(result => {
        console.log('Dropped Collection:', result);
    })
    .catch(err => console.log('No collection to drop.'));
    
    dboper.insertDocument(db, {name: "Breadcrumb Trail Campground", description: "Test"}, 'campsites')
    .then(result => {
        console.log('Insert Document:', result.ops);

        return dboper.findDocuments(db, 'campsites');
    })
    .then(docs => {
        console.log('Found Documents:', docs);

        return dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
            { description: "Updated Test Description" }, 'campsites');
    })
    .then(result => {
        console.log('Updated Document Count:', result.result.nModified);

        return dboper.findDocuments(db, 'campsites');
    })
    .then(docs => {
        console.log('Found Documents:', docs);

        return dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" }, 'campsites');
    })
    .then(result => {
        console.log('Deleted Document Count:', result.deletedCount);

        return client.close();  //closes client connection to mongoDB server; if error occurs here it is handled by promise chain
    })
    .catch(err => {
        console.log(err);
        client.close();  //in case err is thrown before the last .then block 
    });
})
.catch(err => console.log(err));