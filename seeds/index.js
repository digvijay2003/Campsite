const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedhelper');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const Sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    const price = Math.floor(Math.random()*20 + 10);
    for (i=0; i<10; i++){
        const random = Math.floor(Math.random()*1000)
        const camp = new Campground({
            author:'641061c0a295270dc0bac334',
            location:`${cities[random].city},${cities[random].state}`,
            tittle: `${Sample(descriptors)}  ${Sample(places)}`,
            description: '  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, tempora ad. Magnam, nobis laboriosam. Cupiditate necessitatibus perspiciatis asperiores nam. Corrupti incidunt illum alias sed esse voluptates deserunt ratione in sit.',
            price,
            geometry:{
              type:"Point",
              coordinates:[
                cities[random].longitude,
                cities[random].latitude
              ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dnbm7yq9w/image/upload/v1681577438/ivfzk6nwscxhdqugjdr3.jpg',
                  filename: 'qb5nryqh9lcbirp8fyq7',
                },
                {
                  url: 'https://res.cloudinary.com/dnbm7yq9w/image/upload/v1678897862/b7yccxegaxnokrcjdwsv.jpg',
                  filename: 'b7yccxegaxnokrcjdwsv',
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
})