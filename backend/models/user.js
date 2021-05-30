const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    // unique: true => does not add any validation in Mongo unlike 'required' which throws error if the value is not provided;
    //  it is used by Mongo for internal optimisation @See Lect 98: 4:11/6:23
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
// We have named the model as "User". 
// Mongoose will automaticaly create collection using this name but with plural 
// and all in lower case i.e. --> "users"