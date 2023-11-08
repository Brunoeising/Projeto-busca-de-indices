const mongoose = require("mongoose");

const { Schema } = mongoose;

const valueindSchema = new Schema({
  fonteId: { 
    type: Number,
    required: true,
  },
  ano: {
    type: Number,
    required: true,
  },
  mes: {
    type: Number,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  observações: {
    type: String,
    required: false,
  },
  updatedAt: {  
    type: Date,
    default: Date.now
},
}, { timestamps: true });

const Valueindices = mongoose.model("Valueindices", valueindSchema);

module.exports = {
  Valueindices,  
  valueindSchema,
};
