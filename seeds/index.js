const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 200; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: '61f95e2453360cc7c272ed47',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique earum accusantium doloremque facere beatae nobis ex! Sit rem explicabo ea a corporis eum animi labore doloremque, aliquid modi saepe exercitationem?",
			price,
			geometry: {
				type: "Point",
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude
				]
			},
			images: [
				{
					url: 'https://res.cloudinary.com/dvaroeslf/image/upload/v1643898247/YelpCamp/kghxifcc1f7pnjvhxfvv.jpg',
					filename: 'YelpCamp/kghxifcc1f7pnjvhxfvv'
				},
				{
					url: 'https://res.cloudinary.com/dvaroeslf/image/upload/v1643898248/YelpCamp/pxtrpa3xn1lqn75ntu46.jpg',
					filename: 'YelpCamp/pxtrpa3xn1lqn75ntu46'
				}
			]
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
