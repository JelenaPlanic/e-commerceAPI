const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    rating:
    {
        type:Number,
        required:[true, "Please provide rating"],
        min:1,
        max:5
    },
    title:
    {
        type:String,
        required:[true, "Please provide review title"],
        trim:true,
        maxLength:100
    },
    comment:
    {
        type:String,
        required:[true, "Please provide review comment"],
    },
    user:
    {
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    product:
    {
        type:mongoose.Types.ObjectId,
        ref:'Product',
        required:true
    }
}, {timestamps:true});

ReviewSchema.index({product:1, user:1}, {unique:true});
ReviewSchema.statics.calculateAverageRating = async function(productId)
{
    console.log(this);
    const result = await this.aggregate([
        {
            '$match':{'product':productId}
        },
        {
            '$group':{
            '_id': null,
            'averageRating':{'$avg': '$rating'},
            'numOfReviews':{'$sum':1}
            }
        }
    ])
    console.log(result);
    try {
        await this.model("Product").findOneAndUpdate({_id:productId},
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0
            }
        );
    } catch (error) {
        console.log(error);
    }
}

ReviewSchema.statics.groupByRating =  async function(productId)
{
    const result = await this.aggregate([
        {
            '$match':{'product': productId}
        },
        {
            '$group':{
                '_id': '$rating',
                'count':{$sum:1}
            }
        }
    ])
    console.log(result);
}



ReviewSchema.post("save", async function(){
    console.log("Post save hook called");
    await this.constructor.calculateAverageRating(this.product);
    await this.constructor.groupByRating(this.product);

})

ReviewSchema.post("deleteOne",{document:true}, async function(){
    console.log("Post delete one hook called!");
    await this.constructor.calculateAverageRating(this.product);
})


module.exports = mongoose.model("Review", ReviewSchema);