const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const crypto = require('crypto');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

//mongodb+srv://namigr78:<db_password>@cluster0.hpt9v.mongodb.net/

mongoose.connect("mongodb+srv://namigr78:namik@cluster0.hpt9v.mongodb.net/")
  .then(() => {

   console.log("mongodb connected");})
  .catch(err => {console.log("error connecting",err)

  });

app.listen(port, () => {
    console.log(`Server is running on por 8000`);
});

const User = require('./models/user');
const Game = require('./models/game');
const Venue = require('./models/venue');



app.post('/register', async (req, res) => {
  try {
    const userData = req.body;

    const newUser = new User(userData);

    await newUser.save();

    const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({userId: newUser._id}, secretKey);

    res.status(200).json({token});
  } catch (error) {
    console.log('Error creating user', error);
    res.status(500).json({error: 'Internal server error'});
  }
});


app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid email'});
    }

    if (user.password !== password) {
      return res.status(401).json({message: 'Invalid password'});
    }

    const secretKey = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign({userId: user._id}, secretKey);

    res.status(200).json({token});
  } catch (error) {
    console.log('error loggin in', error);
    res.status(500).json({message: 'Error loggin In'});
  }
});


const venues = [
  {
    name: 'SD FUTSAL',
    rating: 4,
    deferLink: 'https://playo.page.link/ry8TT',
    fullLink:
      'https://playo.co/venue/?venueId=4ec5b58f-d58f-4ce1-8c84-2caa63007ecc',
    avgRating: 4,
    ratingCount: 3,
    lat: 12.9341796,
    lng: 77.6101537,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://lh5.googleusercontent.com/p/AF1QipPBbZo5SgQOXrwWV3vMvWmR82fggqFJpISSyVA0=w325-h218-n-k-no",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Karnataka',
    address:"AVS Compound, 1st Floor, 1st Cross",
    bookings: [],
  },
  {
    name: 'Pathivara Futsal',
    rating: 4,
    deferLink: "https://z34v4.app.goo.gl/MAAX",
    fullLink: "https://playo.co/venue/?venueId=afbe7186-2f86-4215-8715-4b967f166b09",
    avgRating: 4,
    ratingCount: 3,
    "lat": 13.059883,
    "lng": 77.582389,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://lh5.googleusercontent.com/p/AF1QipOblky1kcdZMvunnI2lqs7DzjNjXnVXdV8CCTas=w325-h218-n-k-no",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"No. 3/1, Kodigehalli Main Road, Adjacent to Cauvery College",
    bookings: [],
  },
  {
    name: 'Tarahara Futsal',
    rating: 4,
    deferLink: "https://z34v4.app.goo.gl/MAAX",
    fullLink: "https://playo.co/venue/?venueId=afbe7186-2f86-4215-8715-4b967f166b09",
    avgRating: 4,
    ratingCount: 3,
    "lat": 13.059883,
    "lng": 77.582389,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://lh3.googleusercontent.com/p/AF1QipNSh5VcHVQ3YgVn10LLWMyx2elgpTYmJjfwEj0n=s1360-w1360-h1020",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"No. 3/1, Kodigehalli Main Road, Adjacent to Cauvery College",
    bookings: [],
  },
  {
    name: 'Sports Arena',
    rating: 4,
    fullLink: "https://playo.co/venue?venueId=6bb450c0-318b-49e5-b7c0-c02a37d34ef8",
    deferLink: "https://z34v4.app.goo.gl/4Kqo",
    avgRating: 4,
    ratingCount: 3,
    lat: 13.053750730700056,
    lng: 77.57626923775621,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://lh3.googleusercontent.com/p/AF1QipNYaGVNttP4ksTbrQ7v0zD5KY2jcNiYb8jkGXx0=s1360-w1360-h1020",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"Sahakar Nagar road, Adjacent to AMCO layout and Tata Nagar, Hebbal",
    bookings: [],
  },
  {
    name: 'Hamro Futsal',
    rating: 4,
    deferLink: "https://z34v4.app.goo.gl/RTF4",
    fullLink: "https://playo.co/venue/?venueId=37f3675b-dfd2-4f30-8506-a3883abef902",
    avgRating: 4,
    ratingCount: 3,
    lat: 13.071497063988476,
    lng: 77.58706385591489,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://lh5.googleusercontent.com/p/AF1QipMjAcNvwcZ-UNimlHU2HPdAXHajeiTOE1DncgYm=w325-h218-n-k-no",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"Vini5 badminton arena, 5th main road, Canara bank layout",
    bookings: [],
  },
  {
    name: 'B.B. Futsal',
    rating: 4,
    fullLink: "https://playo.co/venue?venueId=a0c6ceb4-d09b-4fcf-bafd-6c949a55590c",
    deferLink: "https://z34v4.app.goo.gl/3k9a",
    avgRating: 4,
    ratingCount: 3,
    lat: 13.045735,
    lng: 77.572929,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: ['Pool', 'Snooker'],
    sportsAvailable: [
      {
        id: '10',
        name: 'Badminton',
        icon: 'badminton',
        price: 500,
        courts: [
          {
            id: '10',
            name: 'Standard synthetic court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Standard synthetic court 2',
            number: 2,
          },
          {
            id: '12',
            name: 'Standard synthetic court 3',
            number: 3,
          },
        ],
      },

      {
        id: '11',
        name: 'Cricket',
        icon: 'cricket',
        price: 1100,
        courts: [
          {
            id: '10',
            name: 'Full Pitch 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Full Pitch 2',
            number: 2,
          },
        ],
      },
      {
        id: '12',
        name: 'Tennis',
        icon: 'tennis',
        price: 900,
        courts: [
          {
            id: '10',
            name: 'Court 1',
            number: 1,
          },
          {
            id: '11',
            name: 'Court 2',
            number: 2,
          },
        ],
      },
    ],
    image:"https://lh5.googleusercontent.com/p/AF1QipM3OUtTXwvh_AQXQVFRLP1F3COupQTP1B9Ats8=w325-h218-n-k-no",
    location:
      'No. 27, Museum Rd, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka',
    address:"1st Cross, RMV 2nd Stage, Nagashettihalli bangalore",
    bookings: [],
  },

  
  // Add more venues as need


{
  name: 'Planet Futsal Biratchwk',
  rating: 4,
  deferLink: 'https://playo.page.link/ry8TT',
  fullLink:
    'https://playo.co/venue/?venueId=4ec5b58f-d58f-4ce1-8c84-2caa63007ecc',
  avgRating: 4,
  ratingCount: 3,
  lat: 12.9341796,
  lng: 77.6101537,
  icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
  filter_by: ['Pool', 'Snooker'],
  sportsAvailable: [
    {
      id: '10',
      name: 'Badminton',
      icon: 'badminton',
      price: 5,
      courts: [
        {
          id: '10',
          name: 'Standard synthetic court 1',
          number: 1,
        },
        {
          id: '11',
          name: 'Standard synthetic court 2',
          number: 2,
        },
        {
          id: '12',
          name: 'Standard synthetic court 3',
          number: 3,
        },
      ],
    },

    {
      id: '11',
      name: 'Cricket',
      icon: 'cricket',
      price: 1,
      courts: [
        {
          id: '10',
          name: 'Full Pitch 1',
          number: 1,
        },
        {
          id: '11',
          name: 'Full Pitch 2',
          number: 2,
        },
      ],
    },
    {
      id: '12',
      name: 'Tennis',
      icon: 'tennis',
      price: 9,
      courts: [
        {
          id: '10',
          name: 'Court 1',
          number: 1,
        },
        {
          id: '11',
          name: 'Court 2',
          number: 2,
        },
      ],
    },
  ],
  image:"https://lh3.googleusercontent.com/p/AF1QipMkopS5i0fibY2dmX2X6aMbZ2ET1UrkQ0WTh2tf=s1360-w1360-h1020",
  location:
    'Planet Futsal Biratchwk, M9CM+HP9, Koshi Haraicha 56600',
  address:"Planet Futsal Biratchwk, M9CM+HP9, Koshi Haraicha 56600",
  bookings: [],
},





];




async function addVenues() {
  for (const venueData of venues) {
    // Check if the venue already exists
    const existingVenue = await Venue.findOne({name: venueData.name});

    if (existingVenue) {
      console.log(`Venue "${venueData.name}" already exists. Skipping.`);
    } else {
      // Add the new venue
      const newVenue = new Venue(venueData);
      await newVenue.save();
      console.log(`Venue "${venueData.name}" added successfully.`);
    }
  }
}

addVenues().catch(err => {
  console.error('Error adding venues:', err);
});


app.get('/venues', async (req, res) => {
  try {
    const venues = await Venue.find({});
    console.log("ven",venues)
    res.status(200).json(venues);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Failed to fetch venues'});
  }
});

app.post('/api/venues', async (req, res) => {
  try {
    const venueData = req.body;
    const newVenue = new Venue(venueData);
    await newVenue.save();
    res.status(201).json({ message: 'Venue added successfully', venue: newVenue });
  } catch (error) {
    console.error('Error adding venue:', error);
    res.status(500).json({ message: 'Failed to add venue' });
  }
});


app.post('/creategame', async (req, res) => {
  try {
    const {sport, area, date, time, admin, totalPlayers} = req.body;

    const activityAccess = 'public';

    console.log('sport', sport);
    console.log(area);
    console.log(date);
    console.log(admin);

    const newGame = new Game({
      sport,
      area,
      date,
      time,
      admin,
      totalPlayers,
      players: [admin],
    });

    const savedGame = await newGame.save();
    res.status(200).json(savedGame);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to create game'});
  }
});


app.get('/games', async (req, res) => {
  try {
    const games = await Game.find({})
      .populate('admin')
      .populate('players', 'image firstName lastName');

    if (!games || games.length === 0) {
      return res.status(404).json({ message: "No games found" });
    }

    const currentDate = moment();

    const filteredGames = games.filter(game => {
      const gameDate = moment(game.date, 'Do MMMM'); // Assuming your date format is "9th July"
      const gameTime = game.time.split(' - ')[0]; // Get the start time
      const gameDateTime = moment(
        `${gameDate.format('YYYY-MM-DD')} ${gameTime}`,
        'YYYY-MM-DD h:mm A'
      );

      return gameDateTime.isAfter(currentDate);
    });

    const formattedGames = filteredGames.map(game => ({
      _id: game._id,
      sport: game.sport,
      date: game.date,
      time: game.time,
      area: game.area,
      players: game.players
        .filter(player => player !== null) // Remove null values
        .map(player => ({
          _id: player._id,
          imageUrl: player.image || "", // Handle missing images
          name: player.firstName && player.lastName ? `${player.firstName} ${player.lastName}` : "Unknown Player",
        })),
      totalPlayers: game.totalPlayers,
      queries: game.queries,
      requests: game.requests,
      isBooked: game.isBooked,
      adminName: game.admin ? `${game.admin.firstName} ${game.admin.lastName}` : "Unknown",
      adminUrl: game.admin ? game.admin.image : "",
      matchFull: game.matchFull
    }));

    res.json(formattedGames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch games' });
  }
});

//the games part might give the problem in future





app.get('/upcoming', async (req, res) => {
  try {
    const userId = req.query.userId; // Assuming you have user authentication and req.user contains the authenticated user's info

    console.log('userId', userId);

    // Fetch games where the user is either the admin or a player
    const games = await Game.find({
      $or: [
        {admin: userId}, // Check if the user is the admin
        {players: userId}, // Check if the user is in the players list
      ],
    })
      .populate('admin')
      .populate('players', 'image firstName lastName');

    // Format games with the necessary details
    const formattedGames = games.map(game => ({
      _id: game._id,
      sport: game.sport,
      date: game.date,
      time: game.time,
      area: game.area,
      players: game.players.map(player => ({
        _id: player._id,
        imageUrl: player.image, // Player's image URL
        name: `${player.firstName} ${player.lastName}`, // Optional: Player's name
      })),
      totalPlayers: game.totalPlayers,
      queries: game.queries,
      requests: game.requests,
      isBooked: game.isBooked,
      courtNumber: game.courtNumber,
      adminName: `${game.admin.firstName} ${game.admin.lastName}`,
      adminUrl: game.admin.image, // Assuming the URL is stored in the image field
      isUserAdmin: game.admin._id.toString() === userId,
      matchFull:game.matchFull
    }));

    res.json(formattedGames);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch upcoming games'});
  }
});


app.post('/games/:gameId/request', async (req, res) => {
  try {
    const {userId, comment} = req.body; // Assuming the userId and comment are sent in the request body
    const {gameId} = req.params;

    // Find the game by ID
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({message: 'Game not found'});
    }

    // Check if the user has already requested to join the game
    const existingRequest = game.requests.find(
      request => request.userId.toString() === userId,
    );
    if (existingRequest) {
      return res.status(400).json({message: 'Request already sent'});
    }

    // Add the user's ID and comment to the requests array
    game.requests.push({userId, comment});

    // Save the updated game document
    await game.save();

    res.status(200).json({message: 'Request sent successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to send request'});
  }
});

// app.get('/games/:gameId/requests', async (req, res) => {
//   try {
//     const {gameId} = req.params;
//     const game = await Game.findById(gameId).populate({
//       path: 'requests.userId',
//       select: 'email firstName lastName image skill noOfGames playpals sports', // Select the fields you want to include
//     });

//     if (!game) {
//       return res.status(404).json({message: 'Game not found'});
//     }

//     const requestsWithUserInfo = game.requests.map(request => ({
//       userId: request.userId._id,
//       email: request.userId.email,
//       firstName: request.userId.firstName,
//       lastName: request.userId.lastName,
//       image: request.userId.image,
//       skill: request.userId.skill,
//       noOfGames: request.userId.noOfGames,
//       playpals: request.userId.playpals,
//       sports: request.userId.sports,
//       comment: request.comment,
//     }));

//     res.json(requestsWithUserInfo);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({message: 'Failed to fetch requests'});
//   }
// });

app.get('/games/:gameId/requests', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Fetch game and populate requests with user details
    const game = await Game.findById(gameId).populate({
      path: 'requests.userId',
      match: { _id: { $ne: null } }, // Exclude null user references
      select: 'email firstName lastName image skill noOfGames playpals sports',
    });

    // If game not found
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    console.log("Fetched Game Requests:", game.requests); // Debugging log

    // Ensure we only process valid requests
    const requestsWithUserInfo = game.requests
      .filter(request => request.userId) // Remove null requests
      .map(request => ({
        userId: request.userId._id,
        email: request.userId.email,
        firstName: request.userId.firstName,
        lastName: request.userId.lastName,
        image: request.userId.image,
        skill: request.userId.skill,
        noOfGames: request.userId.noOfGames,
        playpals: request.userId.playpals,
        sports: request.userId.sports,
        comment: request.comment,
      }));

    res.json(requestsWithUserInfo);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(500).json({message: 'User not found'});
    }

    return res.status(200).json({user});
  } catch (error) {
    res.status(500).json({message: 'Error fetching the user details'});
  }
});


app.get('/game/:gameId/players', async (req, res) => {
  try {
    const {gameId} = req.params;
    const game = await Game.findById(gameId).populate('players');

    if (!game) {
      return res.status(404).json({message: 'Game not found'});
    }

    res.status(200).json(game.players);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch players'});
  }
});


app.get('/games/:gameId/requests', async (req, res) => {
  try {
    const {gameId} = req.params;
    const game = await Game.findById(gameId).populate({
      path: 'requests.userId',
      select: 'email firstName lastName image skill noOfGames playpals sports', // Select the fields you want to include
    });

    if (!game) {
      return res.status(404).json({message: 'Game not found'});
    }

    const requestsWithUserInfo = game.requests.map(request => ({
      userId: request.userId._id,
      email: request.userId.email,
      firstName: request.userId.firstName,
      lastName: request.userId.lastName,
      image: request.userId.image,
      skill: request.userId.skill,
      noOfGames: request.userId.noOfGames,
      playpals: request.userId.playpals,
      sports: request.userId.sports,
      comment: request.comment,
    }));

    res.json(requestsWithUserInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Failed to fetch requests'});
  }
});

app.post('/accept', async (req, res) => {
  const {gameId, userId} = req.body;

  console.log('user', userId);

  console.log('heyy', gameId);

  try {
    // Find the game
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({message: 'Game not found'});
    }

    game.players.push(userId);

    // Remove the user from the requests array
    // game.requests.splice(requestIndex, 1);

    await Game.findByIdAndUpdate(
      gameId,
      {
        $pull: {requests: {userId: userId}},
      },
      {new: true},
    );

    // Save the updated game
    await game.save();

    res.status(200).json({message: 'Request accepted', game});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

// app.post('/accept', async (req, res) => {
//   const {gameId, userId} = req.body;

//   try {
//     const game = await Game.findById(gameId);
//     if (!game) {
//       return res.status(404).json({message: 'Game not found'});
//     }

//     game.players.push(userId);
//     await game.addPlayerNotification(userId); // Add notification logic

//     await Game.findByIdAndUpdate(
//       gameId,
//       {
//         $pull: {requests: {userId: userId}},
//       },
//       {new: true},
//     );

//     await game.save();

//     res.status(200).json({message: 'Request accepted', game});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({message: 'Server error'});
//   }
// });



app.post('/send-request', async (req, res) => {
  const { gameId, userId, comment } = req.body;

  try {
    // Find the game by its ID
    const game = await Game.findById(gameId);

    // Check if the user has already sent a request
    const existingRequest = game.requests.find((request) => request.userId.toString() === userId);

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already sent a request.' });
    }

    // Create the request and add it to the game's requests
    const newRequest = { userId, comment };
    game.requests.push(newRequest);
    await game.save();

    return res.status(200).json({ message: 'Request sent successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.' });
  }
});


app.post('/retire', async (req, res) => {
  const {gameId, userId} = req.body;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({message: 'Game not found'});
    }

    // Remove player from players array
    game.players = game.players.filter(
      playerId => playerId.toString() !== userId
    );

    // Add player to retired array
    if (!game.retired) {
      game.retired = [];
    }
    game.retired.push(userId);

    await game.save();

    res.status(200).json({message: 'Player retired successfully', game});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
});











app.post('/toggle-match-full', async (req, res) => {
  try {
    const { gameId } = req.body;

    // Find the game by its ID
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Toggle the matchFull status
    game.matchFull = !game.matchFull;
    await game.save();

    res.json({ message: 'Match full status updated', matchFull: game.matchFull });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update match full status' });
  }
});





// Add this near the top with your other requires
const Message = require('./models/message');

// Add these new endpoints

// Send a message
// app.post('/messages', async (req, res) => {
//   try {
//     const { gameId, userId, message } = req.body;
    
//     // Verify that the user is a player in the game
//     const game = await Game.findById(gameId);
//     if (!game) {
//       return res.status(404).json({ message: 'Game not found' });
//     }
    
//     if (!game.players.includes(userId)) {
//       return res.status(403).json({ message: 'You must be a player in the game to send messages' });
//     }
    
//     const newMessage = new Message({
//       gameId,
//       userId,
//       message,
//     });
    
//     await newMessage.save();
    
//     res.status(200).json(newMessage);
//   } catch (error) {
//     console.error('Failed to send message:', error);
//     res.status(500).json({ message: 'Failed to send message' });
//   }
// });

app.post('/messages', async (req, res) => {
  try {
    const { gameId, userId, message } = req.body;
    
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    if (!game.players.includes(userId)) {
      return res.status(403).json({ message: 'You must be a player in the game to send messages' });
    }
    
    const newMessage = new Message({
      gameId,
      userId,
      message,
    });
    
    await newMessage.save();
    await newMessage.addMessageNotification(); // Add notification logic
    
    res.status(200).json(newMessage);
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Get messages for a game
app.get('/messages/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Verify that the game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    const messages = await Message.find({ gameId })
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: 1 });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});




app.post('/reject', async (req, res) => {
  const { gameId, userId } = req.body;

  try {
    // Find the game
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Remove the user from the requests array
    await Game.findByIdAndUpdate(
      gameId,
      {
        $pull: { requests: { userId: userId } },
      },
      { new: true }
    );

    res.status(200).json({ message: 'Request rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});






// const Payment = require('./models/Payment'); // Import the Payment model

app.post('/book', async (req, res) => {
  const { courtNumber, date, time, userId, name, game } = req.body;

  try {
    const venue = await Venue.findOne({ name: name });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Check for booking conflicts
    const bookingConflict = venue.bookings.find(
      booking => booking.courtNumber === courtNumber && booking.date === date && booking.time === time
    );

    if (bookingConflict) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // Add new booking
    venue.bookings.push({ courtNumber, date, time, user: userId, game });
    await venue.save();

    // Update the game to mark it as booked
    await Game.findByIdAndUpdate(game, {
      isBooked: true,
      courtNumber: courtNumber,
    });

    res.status(200).json({ message: 'Booking successful', venue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const Profile = require('./models/Profile'); // Import your Profile model

// Get profile data
app.get('/profile/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).send('Profile not found');
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Server error');
  }
});

// Update bio and links
app.post('/profile/:userId/bio', async (req, res) => {
  const { bio, links } = req.body; // Extract bio and links from the request body
  try {
    // Update or create the profile for the user
    await Profile.findOneAndUpdate(
      { userId: req.params.userId }, // Find the profile by userId
      { bio, links }, // Update bio and links
      { new: true, upsert: true } // Create if it doesn't exist
    );
    res.sendStatus(200); // Respond with a success status
  } catch (error) {
    console.error('Error saving bio:', error); // Log any errors
    res.status(500).send('Server error'); // Respond with an error status
  }
});

// Add activity
app.post('/profile/:userId/activities', async (req, res) => {
  const { title, description, date } = req.body; // Expecting activity details in the request body
  try {
    await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      { $push: { activities: { title, description, date } } },
      { new: true, upsert: true }
    );
    res.sendStatus(200);
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).send('Server error');
  }
});






// Endpoint to verify payment
// api/index.js
// const axios = require('axios');

app.post('/verify-payment', async (req, res) => {
  const { token, amount } = req.body;

  try {
    const response = await axios.post('https://khalti.com/api/v2/payment/verify/', {
      token,
      amount,
    }, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, // Use the secret key from environment variables
      },
    });

    if (response.data.state.name === 'Completed') {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});




//Notifications part

const Notification = require('./models/notification'); // Add this line
// app.get('/notifications', async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error('Failed to fetch notifications:', error);
//     res.status(500).json({ message: 'Failed to fetch notifications' });
//   }
// });
// Assuming you have a route to fetch notifications
// Assuming you have a route to fetch notifications
// Assuming you have a route to fetch notifications
app.get('/notifications', async (req, res) => {
  try {
    const userId = req.query.userId;
    const notifications = await Notification.find({ userId })
      .populate('userId', 'firstName lastName image') // Populate user information
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});




app.post('/games/:gameId/request', async (req, res) => {
  const { gameId } = req.params;
  const { userId, comment } = req.body;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.requests.push({ userId, comment });
    await game.save();

    // Create a notification for the game admin
    const notification = new Notification({
      userId: game.admin, // Notify the admin
      message: `User ${userId} requested to join your game.`,
      type: 'request',
      gameId: gameId,
    });

    await notification.save();

    res.status(200).json({ message: 'Request sent', game });
  } catch (error) {
    console.error('Failed to send request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



const PaymentHistory = require('./models/paymentHistory');

app.post('/save-payment-history', async (req, res) => {
  try {
    const { userId, token, amount, courtNumber, date, time, name, game } = req.body;
    const paymentHistory = new PaymentHistory({
      userId,
      token,
      amount,
      courtNumber,
      date,
      time,
      name,
      game,
    });

    await paymentHistory.save();
    res.status(200).json({ message: 'Payment history saved successfully' });
  } catch (error) {
    console.error('Error saving payment history:', error);
    res.status(500).json({ message: 'Error saving payment history', error });
  }
});


const Skills = require('./models/Skills'); // Import the Skills model

// Fetch user skillsr
app.get('/api/users/:userId/skills', async (req, res) => {
  try {
    const skills = await Skills.findOne({ userId: req.params.userId });
    res.json({ skills: skills ? skills.skills : {} });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
});

// Update user skills
app.post('/api/users/:userId/skills', async (req, res) => {
  try {
    const { skills } = req.body;
    const updatedSkills = await Skills.findOneAndUpdate(
      { userId: req.params.userId },
      { skills },
      { new: true, upsert: true }
    );
    res.json({ skills: updatedSkills.skills });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ message: 'Failed to update skills' });
  }
});