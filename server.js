const express = require("express");
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const uri = "mongodb+srv://Akash01:Akash123@cluster0.suje2.mongodb.net/sample_mflix?retryWrites=true&w=majority";

let collection;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        collection = client.db().collection('tech');
        console.log('Connected to MongoDB');

        const count = await collection.countDocuments();
        if (count === 0) {
            await collection.insertMany([
                {
                    title: "BootStrap",
                    path: "images/bootstrap.jpeg",
                    subTitle: "About BootStrap",
                    description: "Bootstrap is the most popular HTML, CSS, and JavaScript framework for developing responsive, mobile-first websites.",
                },
                {
                    title: "jQuery",
                    path: "images/jquery.jpeg",
                    subTitle: "About Jquery",
                    description: "Query is a JavaScript Library.jQuery greatly simplifies JavaScript programming.jQuery is easy to learn.",
                },
                {
                    title: "Reactjs",
                    path: "images/reactjs.jpeg",
                    subtitle: "About Reactjs",
                    description: "React is a JavaScript library for building user interfaces. React is used to build single-page applications. React allows us to create reusable UI components.",
                },
            ]);
            console.log("Data inserted into MongoDB");
        }
    } catch (ex) {
        console.error("Error connecting to MongoDB:", ex);
    }
}

connectToMongoDB().catch(console.error);

// POST route to store form data in MongoDB
app.post('/api/tech', async (req, res) => {
    try {
        const formData = req.body;
        const result = await collection.insertOne(formData);
        console.log("New card added:", formData);
        res.json({ success: true, message: 'added successfully' });
    } catch (error) {
        console.error('Error storing form data in MongoDB:', error);
        res.status(500).json({ success: false, message: 'Failed to store form data' });
    }
});

// API route to fetch tech data from MongoDB
app.get('/api/tech', async (req, res) => {
    try {
        const tech = await collection.find({}).toArray();
        res.json({ success: true, data: tech });
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch data' });
    }
});

// Root route to serve a static HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Serving the index.html file
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
