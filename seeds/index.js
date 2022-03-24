require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios").default;
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const random = (array) => array[Math.floor(Math.random() * array.length)];

// Call unsplash and return small image
async function seedImg() {
  try {
    const res = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: process.env.UNSPLASH_CLIENT_ID,
        // orientation: "landscape",
        collections: 429524,
      },
    });
    return res.data.urls.regular;
  } catch (err) {
    console.error(err);
  }
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    // Seed data into campground
    const camp = new Campground({
      author: "6228a7dd4803decca0a8e998",
      title: `${random(descriptors)} ${random(places)}`,
      location: `${random(cities).city}, ${random(cities).state}`,
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!",
      price: Math.floor(Math.random() * 20) + 10,
      geometry: {
        type: "Point",
        coordinates: [random(cities).longitude, random(cities).latitude],
      },
      // imageUrl: await seedImg(),
      images: [
        {
          url: "https://res.cloudinary.com/dayegbx9o/image/upload/v1647264475/YelpCamp/qflqnarj1xua7hreamqi.jpg",
          filename: "YelpCamp/qflqnarj1xua7hreamqi",
        },
        {
          url: "https://res.cloudinary.com/dayegbx9o/image/upload/v1647242993/YelpCamp/rsybc70kowukcftjvion.jpg",
          filename: "YelpCamp/rsybc70kowukcftjvion",
        },
        {
          url: "https://res.cloudinary.com/dayegbx9o/image/upload/v1647242991/YelpCamp/eyvtj50nw39dhsxsn4y9.jpg",
          filename: "YelpCamp/eyvtj50nw39dhsxsn4y9",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
