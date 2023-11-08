const mongoose = require("mongoose");
const { Schema } = mongoose;

const customFieldSchema = new Schema({
    name: String,
    value: String,
});

const PersonSchema = new Schema({
    id: String,
    isActive: Boolean,
    personType: Number,
    profileType: Number,
    accessProfile: String,
    businessName: String,
    cpfCnpj: String,
    customFields: [customFieldSchema],

}, { timestamps: true });

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;