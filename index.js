// Import required libraries
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

// Create an Express application
const app = express();
app.use(express.json()); // for parsing application/json

// Health endpoint registered immediately
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// Build the MongoDB connection URL from environment variables
const mongoUrl = `mongodb://${process.env.MONGO_USER}:` +
                 `${process.env.MONGO_PASSWORD}@` +
                 `${process.env.MONGO_HOST}:` +
                 `${process.env.MONGO_PORT}/admin`;

// Connect to MongoDB
MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db('sit323db');
    console.log('✅ Connected to MongoDB');

    // Home page
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>SIT323 Task 6.2C – Interacting with Kubernetes</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #ffeef4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 800px;
                margin: 100px auto;
                padding: 30px;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                text-align: center;
              }
              h1 {
                color: #d63384;
                font-size: 32px;
                margin-bottom: 10px;
              }
              h2 {
                color: #555;
                font-weight: normal;
                margin-bottom: 20px;
              }
              p {
                font-size: 18px;
                color: #444;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #888;
              }
            </style>
          </head>
          <body>
           <div class="container">
              <h1>Task 9.1P – MongoDB Integration</h1>
              <h2>Cloud Native App Development | SIT323</h2>
              <p>This microservice now connects to a MongoDB database running in the cluster.</p>
              <p>Use the /data endpoints to perform CRUD operations on the <code>items</code> collection.</p>
              <div class="footer">
                <p>Created by Hope Russo | Port: 3000</p>
              </div>
            </div>
          </body>
        </html>
      `);
    });

    // READ: List all items in a styled HTML page
    app.get('/data', async (req, res) => {
      try {
        const items = await db.collection('items').find().toArray();
        const listHtml = items.map(item => `
          <li class="item">
            <span class="item-name">${item.name}</span>
            <span class="item-id">(${item._id})</span>
          </li>
        `).join('');

        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Data – SIT323 Microservice</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background-color: #ffeef4;
                  margin: 0; padding: 0;
                }
                .container {
                  max-width: 800px;
                  margin: 80px auto;
                  padding: 30px;
                  background: #fff;
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                h1 {
                  color: #d63384;
                  font-size: 28px;
                  margin-bottom: 20px;
                }
                ul {
                  list-style: none;
                  padding: 0;
                }
                .item {
                  padding: 10px 0;
                  border-bottom: 1px solid #eee;
                  display: flex;
                  justify-content: space-between;
                }
                .item:last-child {
                  border-bottom: none;
                }
                .item-name {
                  font-weight: bold;
                  color: #333;
                }
                .item-id {
                  color: #888;
                  font-size: 0.9em;
                }
                .back-link {
                  display: inline-block;
                  margin-top: 20px;
                  text-decoration: none;
                  color: #d63384;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Stored Items</h1>
                <ul>
                  ${listHtml}
                </ul>
                <a href="/" class="back-link">&larr; Back to Home</a>
              </div>
            </body>
          </html>
        `);
      } catch (err) {
        res.status(500).send(`Error loading data: ${err.message}`);
      }
    });

    // CREATE: Add a new item
    app.post('/data', async (req, res) => {
      try {
        const insertResult = await db.collection('items').insertOne(req.body);
        const newItem = await db.collection('items')
          .findOne({ _id: insertResult.insertedId });
        res.status(201).json(newItem);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // UPDATE: Modify an existing item
    app.put('/data/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const update = { $set: req.body };

        const result = await db.collection('items').updateOne(filter, update);
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Item not found' });
        }

        const updatedItem = await db.collection('items').findOne(filter);
        res.json(updatedItem);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // DELETE: Remove an item
    app.delete('/data/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };

        const result = await db.collection('items').deleteOne(filter);
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item deleted' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Start the server
    app.listen(3000, () => {
      console.log("Express App running at http://127.0.0.1:3000/");
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
  });
