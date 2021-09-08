const mongose = require('mongoose');

const VolunteerSchema = new mongose.Schema({
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
  specialization: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Volunteer = mongose.model('Volunteer', VolunteerSchema);


module.exports = Volunteer;
