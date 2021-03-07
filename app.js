const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const express = require('express');
const request = require('request');
const https = require('https');
const apn = express();

apn.use(bodyParser.urlencoded({
  extended: true
}));

apn.use(express.static("public"));

var serviceAccount = require(__dirname + "/public/meta-gateway-306808-firebase-adminsdk-5rwm0-03073d07a0.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://meta-gateway-306808-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

const docRef = db.collection('sleep_datum').doc('alarm_data');

async function test(d, t) {
  await docRef.set({
    days: d,
    time: t
  });
}

apn.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

apn.post("/", function(req, res) {
  const time = req.body['time'];
  const days = req.body['days'];
  var data = [];
  if (days === undefined) {
    res.sendFile(__dirname + "/failure.html");
  } else if (days.length === 1) {
    data = [days];
    test(data, time);
    res.sendFile(__dirname + "/success.html");
  } else {
    data = days;
    test(data, time);
    res.sendFile(__dirname + "/success.html");
  }

  for (var i = 0; i < data.length; ++i) {
    data[i] = parseInt(data[i], 10);
  }
  console.log(req.body);
});


apn.listen(3000 || process.env.PORT, function() {
  console.log('Server running on port 3000');
});
