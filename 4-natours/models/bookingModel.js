const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour', // Pointing to Tour model
    required: [true, 'Booking must belong to a Tour!'],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Pointing to Tour model
    required: [true, 'Booking must belong to a User!'],
  },

  price: {
    type: Number,
    required: [true, 'Booking must have a price'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  // we set paid to true by default because an admin can make a booking outside of online(stripe). Such as direcly person to person.
  paid: {
    type: Boolean,
    default: true,
  },
});

// Populating tour and user data automatically when an query happens
bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
