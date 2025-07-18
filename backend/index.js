const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = 'mongodb+srv://ekalaja:admin@pulsecluster0.zzm0e.mongodb.net/?retryWrites=true&w=majority&appName=pulsecluster0';
// const uri = 'mongodb://127.0.0.1:27017/pulsedb';
const client = new MongoClient(uri);

app.use(cors());
app.use(bodyParser.json());

(async function connectDB() {
  try {
    await client.connect();
    const database = client.db('pulsedb');
    const userTable = database.collection('Users');

    console.log('MongoDB connected successfully');

    app.post('/createUser', async (req, res) => {
      const { gender, height } = req.body;
      if (!gender || !height) {
        return res.status(400).json({ error: 'Please provide both gender and height' });
      }
      try {
        const numericHeight = parseFloat(height);

        let stride;
        if (gender.toLowerCase() === 'male') {
        stride = numericHeight * 0.415;
        } else if (gender.toLowerCase() === 'female') {
        stride = numericHeight * 0.4;
        } else {
        return res.status(400).json({ error: 'Invalid gender provided' });
        }
        
        const newUser = { gender, height: numericHeight, stride};
        const result = await userTable.insertOne(newUser);
        res.status(201).json({ message: 'Data saved successfully!', data: result });
      } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data to MongoDB' });
      }
    });
    
    app.get('/getUser', async (req, res) => {
        const { userId } = req.query;
        if (!userId) {
          return res.status(400).json({ error: 'Please provide a userId' });
        }
        try {
          const user = await userTable.findOne({ _id: new ObjectId(userId) });
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json({ message: 'User data retrieved successfully', data: user });
        } catch (error) {
          console.error('Error fetching user data:', error);
          res.status(500).json({ error: 'Failed to fetch user data from MongoDB' });
        }
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
})();

app.get('/recs', callRecs); 
function callRecs (req, res) {
    var spawn = require("child_process").spawn; 
    var process = spawn('python',["./recs.py", "37i9dQZF1E37Kg40mFJtCf"]);//req.query.playlist_id]);
    process.stdout.on('data', function(data) { 
        res.send(data.toString()); 
    });
}

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
