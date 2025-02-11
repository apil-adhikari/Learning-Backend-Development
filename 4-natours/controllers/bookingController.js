const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getCheckoutSession = catchAsyncError(async (req, res, next) => {
  // Fetch the tour data from the database
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new Error('Tour not found'));
  }

  // Create a new checkout session with the updated API
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: `${tour.summary}`, // The description of the tour
            images: [`https://natours.dev/img/tours/tour-2-cover.jpg`], // Image URL
          },
          unit_amount: Math.round(tour.price * 100), // Amount in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment', // Defines the checkout mode as a one-time payment
    success_url: `${req.protocol}://${req.get('host')}/`, // URL after successful payment
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`, // URL if the user cancels
    customer_email: req.user.email, // Customer's email
    client_reference_id: req.params.tourId, // Custom reference to identify the tour
  });

  // console.log(session);

  // Respond with the session details
  res.status(200).json({
    status: 'success',
    session,
  });
});
