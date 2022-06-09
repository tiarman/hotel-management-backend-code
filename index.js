const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');


const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
const port = 8000



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k1cqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const roomCollections = client.db(`${process.env.DB_NAME}`).collection("allRooms");
  const bookingsCollections = client.db(`${process.env.DB_NAME}`).collection("bookings");
  const adminCollections = client.db(`${process.env.DB_NAME}`).collection("admins");
  const reviewCollections = client.db(`${process.env.DB_NAME}`).collection("reviews");

  
//   client.close();

// App Send to database
app.post('/add-rooms', (req, res) => {
  roomCollections.insertOne(req.body)
      .then(result => res.send(!!result.insertedCount))
})

// app.post('/add-rooms', (req, res) => {
//   roomCollections.insertOne(req.body)
//       .then(result => res.send(!!result.insertedCount))
// })


app.post('/add-booking',(req,res)=>{
  bookingsCollections.insertOne(req.body)
  .then(result=>{
    res.send(result.insertedCount > 0)
  })
})



app.post('/add-admin', (req,res)=>{
  const newAdmin = req.body.email;
  adminCollections.insertOne({email:newAdmin})
  .then(result =>{
    res.send(result.insertedCount > 0)
  })
})


app.post('/addReview', (req, res) => {
  reviewCollections.insertOne(req.body)
      .then(result => res.send(!!result.insertedCount))
})

// Get From database
// app.get('/all-rooms', (req, res) => {
//   roomCollections.find({})
//       .toArray((err, docs) => res.send(docs))
// })

app.get('/all-rooms', (req, res) => {
  roomCollections.find({})
      .toArray((err, document) => {
          res.send(document)
      })
})


app.get('/all-bookings', (req, res) => {
  bookingsCollections.find({})
      .toArray((err, bookings) => {
          res.send(bookings);
      })
});

app.get('/bookingsByEmail', (req, res)=>{
  bookingsCollections.find({email: req.query.email})
  .toArray((err, booking)=>{
    res.send( booking)
  })
})



app.get('/isAdmin', (req, res)=>{
  const email = req.query.email
  adminCollections.find({email:email})
  .toArray((err, admins) => {
    res.send(admins.length > 0)
  })  
})

app.get('/all-admin', (req, res) => {
  adminCollections.find({})
   .toArray((err, reviews) => {
      res.send(reviews);
    })
});



app.get('/reviews', (req, res) => {
  if (req.query.email) {
      return reviewCollections.find({ email: req.query.email })
          .toArray((err, docs) => res.send(docs[0]))
  }
  reviewCollections.find({})
      .toArray((err, docs) => res.send(docs))
})


app.get('/all-review', (req, res) => {
  reviewCollection.find({})
   .toArray((err, reviews) => {
      res.send(reviews);
    })
});

// Delete


// app.delete('/deleteRooms/:id', (req, res) => {
//   roomCollections.deleteOne({ _id: ObjectId(req.params.id) })
//       .then(result => {
//           res.send(result.deletedCount > 0)
//       })
// })
// app.delete('/room-delete/:id', (req, res)=>{
//   roomCollections.deleteOne({_id: ObjectId(req.params.id)})
//   .then( result =>{
//     res.send(result.deletedCount > 0)
//   })
// })
app.delete('/delete-rooms/:id', (req, res) => {
  roomCollections.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => res.send(!!result.deletedCount))
})



app.delete('/cancel-booking/:id', (req, res)=>{
  bookingsCollections.deleteOne({_id: ObjectId(req.params.id)})
  .then( result =>{
    res.send(result.deletedCount > 0)
  })
})


app.delete('/remove-admin/:id', (req, res)=>{
  adminCollections.deleteOne({_id: ObjectId(req.params.id)})
  .then( result =>{
    res.send(result.deletedCount > 0)
  })
})


app.delete('/deleteReview/:id', (req, res) => {
        reviewCollections.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => res.send(!!result.deletedCount))
    })

// Update
// app.patch('/update/:id', (req, res) => {
//   roomCollections.updateOne(
//       { _id: ObjectId(req.params.id) },
//       {
//           $set: req.body
//       }
//   ).then(result => res.send(!!result.modifiedCount))
// })



app.patch('/update-book-status', (req, res) => {
  const { id, status } = req.body;
  bookingsCollections.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
          $set: { status },
      }
  ).then(result => res.send(result.lastErrorObject.updatedExisting))
})


app.patch('/updateReview/:id', (req, res) => {
  reviewCollections.updateOne(
      { _id: ObjectId(req.params.id) },
      {
          $set: req.body
      }
  ).then(result => res.send(!!result.modifiedCount))
})




app.patch('/update-rooms/:id', (req, res) => {
  roomCollections.updateOne({ _id: ObjectId(req.params.id) }, {
      $set: req.body
  })
      .then(result => {
          res.send(result.modifiedCount > 0)
      })

})


// app.patch('/updateRooms/:id', (req, res) => {
//   roomCollections.updateOne({ _id: ObjectId(req.params.id) }, {
//       $set: { name: req.body.name, price: req.body.price, description: req.body.description}
//   })
//       .then(result => {
//           res.send(result.modifiedCount > 0)
//       })

// })


app.get('/', (req, res) => {
  res.send('Welcome to Hotel Management System');
})

console.log("Database Connected")
});


app.listen(process.env.PORT || port)