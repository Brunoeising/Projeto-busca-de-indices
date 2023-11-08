const mongoose = require("mongoose");

const { Schema } = mongoose;

const valueindSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
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
  updatedAt: {  
    type: Date,
    default: Date.now
},
}, { timestamps: true });

const fonteSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  fonte: {
    type: String,
    required: true,
  },
  sigla: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: false,
  },
  frequencia: {
    type: String,
    required: false,
  },
  observações: {
    type: String,
    required: false,
  },
  urlfonte: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  valueind: [valueindSchema],
}, { timestamps: true });

const Fonte = mongoose.model("Fonte", fonteSchema);

module.exports = Fonte;
