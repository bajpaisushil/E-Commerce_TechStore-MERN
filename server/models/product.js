const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    name: {
        type: String,
        required: [true, "Can't be blank"]
    },
    description: {
        type: String,
        required: [true, "Can't be blank"]
    },
    price: {
        type: String,
        required: [true, "Can't be blank"]
    },
    category: {
        type: String,
        required: [true, "Can't be blank"]
    },
    pictures: {
        type: Array,
        required: true
    }
}, {minimize: false})

const Product=mongoose.model("Product", productSchema);

module.exports=Product;
