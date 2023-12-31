const mongoose= require('mongoose');
const Review = require('./reviews')
// const { campgroundSchema } = require('../schemas');
// const { string } = require('joi');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get( function (){
    return this.url.replace('/upload','/upload/w_150,h_150,bo_3px_solid_black')
});

const opts = {toJSON: {virtuals:true}}; 

const CampGroundSchema = new Schema({
    tittle:String,
    images:[ImageSchema],
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price:Number,
    description:String,
    location:String,
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts);

CampGroundSchema.virtual('properties.popUpMarkup').get( function (){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.tittle}</a></strong>
    <p>${this.description.substring(0,20)}</p>
    `
})

CampGroundSchema.post('findOneAndDelete', async function (doc){
    if (doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampGroundSchema);