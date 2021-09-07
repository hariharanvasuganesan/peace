const mongose = require('mongoose');

const VlntSchema = new mongose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  spec: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Vlnt = mongose.model('Vlnt', VlntSchema);


module.exports = Vlnt;
