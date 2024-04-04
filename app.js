//Install Command:
//npm init
//npm install express
//npm i express express-handlebars body-parser
//npm i install express-session
//npm install multer
//npm i express express-handlebars body-parser mongodb
//npm install bcrypt


const express = require('express');
const server = express();
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));
server.use(session({
    secret: 'gameboy', // Replace 'your_secret_key' with a secret key for session encryption
    resave: false,
    saveUninitialized: true
}));


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));




const { MongoClient } = require('mongodb');
const databaseURL = "mongodb://127.0.0.1:27017/";
const databaseName = "gameboydb";
const collectionName = "user";
const collectionName1 = "game";
const collectionName2 = "reviews";
const collectionName3 = "developer";

const mongoClient = new MongoClient(databaseURL);

mongoClient.connect()
    .then(function (con) {
        console.log("Database connected!");
        const dbo = mongoClient.db(databaseName);
        dbo.createCollection(collectionName)
            .then(() => console.log('User collection created'))
            .catch(errorFn);
        dbo.createCollection(collectionName1)
            .then(() => console.log('Game collection created'))
            .catch(errorFn);
        dbo.createCollection(collectionName2)
            .then(() => console.log('Reviews collection created'))
            .catch(errorFn);
        dbo.createCollection(collectionName3)
            .then(() => console.log('Developer collection created'))
            .catch(errorFn);
    })
    .catch(errorFn);

function errorFn(err) {
    console.error('Error found. Please trace!');
    console.error(err);
}

server.use(express.static('public'));

server.get('/', function(req, resp){
    resp.render('homepage-without-login',{
        layout: 'index',
        title: 'GameBoy!'
    });
});

server.get('/gamedeveloper-with-login/:name', function(req, resp){
    const gameDeveloperName = req.params.name;
    const dbo = mongoClient.db(databaseName);
    const gameCollection = dbo.collection(collectionName1);
    const developerCollection = dbo.collection(collectionName3);

    developerCollection.findOne({ name: gameDeveloperName }).then(function(gameDeveloper) {
        if (!gameDeveloper) {
            resp.status(404).send('Game developer not found');
            return;
        }
        
        gameCollection.find({ developer: gameDeveloper.name }).toArray().then(function(games) {
            games.forEach(function(game) {
                if (game.gameImage) {
                    game.gameImageBase64 = game.gameImage.toString('base64');
                }
            });
            
            resp.render('gamedeveloper-with-login', {
                layout: 'index',
                title: 'GameBoy!',
                gameDeveloper: gameDeveloper,
                gamesDeveloped: games
            });
        }).catch(function(error) {
            console.error('Error fetching games developed:', error);
            resp.status(500).send('Error fetching games developed');
        });
    }).catch(function(error) {
        console.error('Database query error:', error);
        resp.status(500).send('Error fetching game developer data');
    });
});

server.get('/homepage-with-login', function(req, resp){
    resp.render('homepage-with-login',{
        layout: 'index',
        title: 'GameBoy!'
    });
});



server.get('/gamedeveloper-without-login/:name', function(req, resp){
    const gameDeveloperName = req.params.name;
    const dbo = mongoClient.db(databaseName);
    const gameCollection = dbo.collection(collectionName1);
    const developerCollection = dbo.collection(collectionName3);

    developerCollection.findOne({ name: gameDeveloperName }).then(function(gameDeveloper) {
        if (!gameDeveloper) {
            resp.status(404).send('Game developer not found');
            return;
        }
        
        gameCollection.find({ developer: gameDeveloper.name }).toArray().then(function(games) {
            games.forEach(function(game) {
                if (game.gameImage) {
                    game.gameImageBase64 = game.gameImage.toString('base64');
                }
            });
            
            resp.render('gamedeveloper-without-login', {
                layout: 'index',
                title: 'GameBoy!',
                gameDeveloper: gameDeveloper,
                gamesDeveloped: games
            });
        }).catch(function(error) {
            console.error('Error fetching games developed:', error);
            resp.status(500).send('Error fetching games developed');
        });
    }).catch(function(error) {
        console.error('Database query error:', error);
        resp.status(500).send('Error fetching game developer data');
    });
});

server.get('/homepage-without-login', function(req, resp){
    resp.render('homepage-without-login',{
        layout: 'index',
        title: 'GameBoy!'
    });
});

server.get('/review', function(req, resp){
    resp.render('review',{
        layout: 'index',
        title: 'GameBoy!'
    });
});

server.get('/review-add-game', function(req, resp){
    resp.render('review-add-game',{
        layout: 'index',
        title: 'GameBoy!'
    });
});

server.post('/review-add-game', upload.single('gameImage'), function(req, res) {
    const { name, developer, description } = req.body;
    const gameImageBuffer = req.file.buffer; // Access uploaded image buffer

    const dbo = mongoClient.db(databaseName);
    const gameCollection = dbo.collection(collectionName1);

    gameCollection.insertOne({ 
        name, 
        developer, 
        description,
        gameImage: gameImageBuffer // Save image buffer to database
    }).then(() => {
        res.redirect('/gameadded');
    }).catch(errorFn);
});


server.get('/allgames-with-login', function(req, res) {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(collectionName1);

    col.find({}).toArray().then(function(games) {
        // Convert binary image data to Base64
        games.forEach(game => {
            // Assuming the field name is 'gameImage' in your MongoDB documents
            game.gameImageBase64 = game.gameImage.toString('base64');
        });

        // Render the template with the game data
        res.render('allgames-with-login', {
            layout: 'index',
            title: 'GameBoy!',
            games: games
        });
    }).catch(errorFn);
});


server.get('/allgames-without-login', function(req, res) {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(collectionName1);

    col.find({}).toArray().then(function(games) {
        // Convert binary image data to Base64
        games.forEach(game => {
            // Assuming the field name is 'gameImage' in your MongoDB documents
            game.gameImageBase64 = game.gameImage.toString('base64');
        });

        res.render('allgames-without-login', {
            layout: 'index',
            title: 'GameBoy!',
            games: games
        });
    }).catch(errorFn);
});


server.get('/edit-user-profile', function(req, resp){
    resp.render('edit-user-profile',{
        layout: 'index',
        title: 'GameBoy!'
    });
});

server.post('/edit-user-profile', upload.single('profilePicture'), function(req, resp) {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(collectionName);
    console.log('edit Session user:', req.session.user);

    // To update a query, it will need to have a search parameter and a change of values.
    const updateQuery = { username: req.session.user.username }; // Assuming the username is unique
    const updateValues = { $set: {} };

    // Extract update values from the request body
    const { name, birthday, about } = req.body;

    // Add fields to updateValues if they are provided in the request
    if (name) updateValues.$set.name = name;
    if (birthday) updateValues.$set.birthday = birthday;
    if (about) updateValues.$set.about = about;

    // If a profile picture is uploaded, add it to updateValues
    if (req.file.buffer) {
        const gameImageBuffer = req.file.buffer; // Access uploaded image buffer
        updateValues.$set.profilePicture = gameImageBuffer; // Assuming filename is stored in req.file
    }

    console.log('updateQuery:', updateQuery);
    console.log('updateValues:', updateValues);

    col.updateOne(updateQuery, updateValues)
        .then(function(result) {
            console.log('Update successful');
            console.log('Inside: ' + JSON.stringify(result));
            if (result.modifiedCount > 0) {
                // Fetch updated user data and update session
                col.findOne({ username: req.session.user.username })
                    .then(function(updatedUser) {
                        req.session.user = updatedUser;
                        resp.redirect('/profileupdated');
                    })
                    .catch(function(error) {
                        console.error('Error fetching updated user data:', error);
                        resp.status(500).send('Internal Server Error');
                    });
            } else {
                resp.redirect('/viewprofile'); // Redirect to a different page if no documents were modified
            }
        })
        .catch(function(error) {
            console.error('Error updating document:', error);
            resp.status(500).send('Internal Server Error'); // Send a 500 status code in case of error
        });
});


server.get('/login', function(req, resp){
    resp.render('login',{
        layout: 'index',
        title: 'GameBoy!'
    });
});

server.get('/signup', function(req, resp){
    resp.render('signup',{
        layout: 'index',
        title: 'GameBoy!'
    });
});

server.get('/checkemail', function(req, resp){
    resp.render('checkemail',{
        layout: 'index',
        title: 'GameBoy!'
    });
});

server.get('/gameadded', function(req, resp){
    resp.render('gameadded',{
        layout: false
    });
});

server.get('/profileupdated', function(req, resp){
    resp.render('profileupdated',{
        layout: false
    });
});

server.get('/forgotpassword', function(req, resp){
    resp.render('forgotpassword',{
        layout: 'index',
        title: 'GameBoy!'
    });
});

let currentGame;



server.get('/game-profile-login/:name', function(req, resp) {
    const gameName = req.params.name;
    const dbo = mongoClient.db(databaseName);
    const gameCollection = dbo.collection(collectionName1);
    const reviewsCollection = dbo.collection(collectionName2); 
    const user = req.session.user;
    resp.locals.user = user; 
    let isBase64 = false;


    console.log("Checking if user is logged in. Session user:", req.session.user);
    if (!req.session.user) {
        return resp.redirect('/login');
    }
    
    gameCollection.findOne({ name: gameName }).then(function(game) {
        if (!game) {
            resp.status(404).send('Game not found');
            return;
        }

        if (game.gameImage) {
            game.gameImageBase64 = game.gameImage.toString('base64');
        }
        
        currentGame = game;

        reviewsCollection.find({ gamename: gameName }).toArray().then(function(reviews) {
            reviews.forEach(review => {
                const isBase64 = /^\/9j\/4AAQSkZJRgABAQEASABIAAD\/2wBD/.test(review.userPic);
                if (isBase64){
                    review.userPic = `data:image/jpeg;base64,${review.userPic}`;
                }
                review.isAuthor = user && review.username === user.username;
            });
            
            const sameDeveloper = user && game.developer === user.name;
            

            resp.render('game-profile-login', {
                layout: 'index',
                title: 'GameBoy!',
                game: game,
                reviews: reviews,
                user:user,
                isBase64:isBase64,
                sameDeveloper:sameDeveloper

            });
        }).catch(function(error) {
            console.error('Error fetching reviews:', error);
            resp.status(500).send('Error fetching reviews');
        });
    }).catch(function(error) {
        console.error('Database query error:', error);
        resp.status(500).send('Error fetching game data');
    });
});



server.get('/game-profile/:name', function(req, resp) {
    const gameName = req.params.name;
    const dbo = mongoClient.db(databaseName);
    const gameCollection = dbo.collection(collectionName1);
    const reviewsCollection = dbo.collection(collectionName2); 

    let isBase64 = false;

    gameCollection.findOne({ name: gameName }).then(function(game) {
        if (!game) {
            resp.status(404).send('Game not found');
            return;
        }

        if (game.gameImage) {
            game.gameImageBase64 = game.gameImage.toString('base64');
        }
        
        currentGame = game;

        reviewsCollection.find({ gamename: gameName }).toArray().then(function(reviews) {
            reviews.forEach(review => {
                const isBase64 = /^\/9j\/4AAQSkZJRgABAQEASABIAAD\/2wBD/.test(review.userPic);
                if (isBase64){
                    review.userPic = `data:image/jpeg;base64,${review.userPic}`;
                }
            });

            resp.render('game-profile', {
                layout: 'index',
                title: 'GameBoy!',
                game: game,
                reviews: reviews,
            });
        }).catch(function(error) {
            console.error('Error fetching reviews:', error);
            resp.status(500).send('Error fetching reviews');
        });
    }).catch(function(error) {
        console.error('Database query error:', error);
        resp.status(500).send('Error fetching game data');
    });
});

server.get('/topgames-with-login', function(req, resp){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(collectionName1);

    col.find({}).toArray().then(function(games) {
        games.forEach(game => {
            game.gameImageBase64 = game.gameImage.toString('base64');
        });

        resp.render('topgames-with-login', {
            layout: 'index',
            title: 'GameBoy!',
            games: games
        });
    }).catch(errorFn);
});


server.get('/topgames-without-login', function(req, resp){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(collectionName1);

    col.find({}).toArray().then(function(games) {
        games.forEach(game => {
            game.gameImageBase64 = game.gameImage.toString('base64');
        });

        resp.render('topgames-without-login', {
            layout: 'index',
            title: 'GameBoy!',
            games: games
        });
    }).catch(errorFn);
});

server.get('/review-create-review', function(req, resp){
    resp.render('review-create-review', {
        layout: 'index',
        title: 'GameBoy!',
        game: currentGame 
    });
});

server.post('/review-create-review', function(req, resp){
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(collectionName2);

    const { gamename, review, rating } = req.body;
    const { username, profilePicture } = req.session.user;

    const reviewInstance = {
        gamename: gamename,
        username: username,
        review: review,
        userPic: profilePicture,
        stars: rating
    };
    
    col.insertOne(reviewInstance)
        .then(() => {
            console.log('Review added successfully');
            resp.redirect('/review-added');
        })
        .catch((error) => {
            console.error('Error adding review:', error);
            resp.status(500).send('Error adding review');
        });
});

server.get('/wrongpass', function(req, res) {
    res.render('wrongpass', {
        layout: false // Disable layouts for this route
    });
});

server.get('/existinguser', function(req, res) {
    res.render('existinguser', {
        layout: false 
    });
});

server.get('/usercreated', function(req, res) {
    res.render('usercreated', {
        layout: false 
    });
});

server.get('/review-added', function(req, res) {
    res.render('review-added', {
        layout: false 
    });
});

server.get('/passconfigwrong', function(req, res) {
    res.render('passconfigwrong', {
        layout: false 
    });
});

function formatDate(date) {
    // Extract day, month, and year components from the date
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    // Return the formatted date string
    return `${day}-${month}-${year}`;
}

server.post('/signup', function (req, res) {
    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(collectionName);

    const { username, name, birthday, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.redirect('/passconfigwrong');
    }

    const currentDate = new Date();
    const signupDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const defaultProfilePicture = 'https://i.pinimg.com/564x/e9/51/25/e951250f7f452c8e278d12ac073b9b5b.jpg'; 

    bcrypt.hash(password, 10, function(err, hashedPassword) {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Error creating user');
        }

        col.findOne({ $or: [{ username }, { email }] }).then(existingUser => {
            if (existingUser) {
                return res.redirect('/existinguser');
            }

            col.insertOne({ 
                username, 
                name, 
                birthday, 
                email, 
                password: hashedPassword, 
                profilePicture: defaultProfilePicture,
                about:"",
                signupDate: formatDate(signupDate),
                isDeveloper: false  
            }).then(() => {
                res.redirect('/usercreated');
            }).catch(errorFn);
        }).catch(errorFn);
    });
});

server.post('/login', function (req, res) {
    const { username, password } = req.body;

    const dbo = mongoClient.db(databaseName);
    const col = dbo.collection(collectionName);

    col.findOne({ username }).then(user => {
        if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
                if (err) {
                    console.error("Error comparing passwords:", err);
                    return res.status(500).send('Internal Server Error');
                }
                if (result) {
                    req.session.user = user;
                    res.redirect('/homepage-with-login');
                } else {
                    res.redirect('/wrongpass');
                }
            });
        } else {
            res.redirect('/wrongpass');
        }
    }).catch(error => {
        console.error("Error during login:", error);
        res.status(500).send('Internal Server Error');
    });
});


server.get('/viewprofile', function(req, res) {
    console.log("Checking if user is logged in. Session user:", req.session.user);
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const user = req.session.user;

    if (user.isDeveloper === true) {
        const gameDeveloperName = user.name;
        const dbo = mongoClient.db(databaseName);
        const gameCollection = dbo.collection(collectionName1);
        const developerCollection = dbo.collection(collectionName3);

        developerCollection.findOne({ name: gameDeveloperName }).then(function(gameDeveloper) {
            if (!gameDeveloper) {
                return res.status(404).send('Game developer not found');
            }

            gameCollection.find({ developer: gameDeveloperName }).toArray().then(function(games) {
                games.forEach(function(game) {
                    if (game.gameImage && Buffer.isBuffer(game.gameImage)) {
                        game.gameImageBase64 = game.gameImage.toString('base64');
                    }
                });

                res.render('gamedeveloper-with-login', {
                    layout: 'index',
                    title: 'GameBoy!',
                    gameDeveloper: gameDeveloper,
                    gamesDeveloped: games
                });
            }).catch(function(error) {
                console.error('Error fetching games developed:', error);
                res.status(500).send('Error fetching games developed');
            });
        }).catch(function(error) {
            console.error('Database query error:', error);
            res.status(500).send('Error fetching game developer data');
        });
    } else {
        const isBase64 = /^\/9j\/4AAQSkZJRgABAQEASABIAAD\/2wBD/.test(user.profilePicture);
        console.log("isBase64:", isBase64); // Check the value
        res.render('viewprofile', {
            layout: 'index',
            title: 'GameBoy!',
            user: user,
            isBase64: isBase64
        });
    }
});




server.get('/api/games', function(req, res) {
    const dbo = mongoClient.db(databaseName);
    const gameCollection = dbo.collection(collectionName1);
    
    gameCollection.find({}, { projection: { _id: 0, name: 1 } }).toArray()
        .then(function(games) {
            res.json(games);
        })
        .catch(function(error) {
            console.error('Error fetching games from database:', error);
            res.status(500).send('Internal server error');
        });
});

function finalClose(){
    console.log('Close connection at the end!');
    mongoClient.close();
    process.exit();
}

process.on('SIGTERM',finalClose);  //general termination signal
process.on('SIGINT',finalClose);   //catches when ctrl + c is used
process.on('SIGQUIT', finalClose); //catches other termination commands

const port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
