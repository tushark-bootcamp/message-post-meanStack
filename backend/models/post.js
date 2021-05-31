const mongoose = require ('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    imagePath: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Post', postSchema);
// We have named the model as "Post". 
// Mongoose will automaticaly create collection using this name but with plural 
// and all in lower case i.e. --> "posts"