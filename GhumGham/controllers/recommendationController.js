const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');

// Function to calculate cosine similarity between two users
const calculateCosineSimilarity = (user1, user2) => {
  const commonTours = user1.bookedTours.filter((tour) =>
    user2.bookedTours.includes(tour),
  );
  const dotProduct = commonTours.length;
  const magnitude1 = Math.sqrt(user1.bookedTours.length);
  const magnitude2 = Math.sqrt(user2.bookedTours.length);
  return dotProduct / (magnitude1 * magnitude2);
};

// Function to get recommendations for a user
exports.getRecommendations = async (req, res, next) => {
  const userId = req.params.id;

  // Fetch all bookings
  const bookings = await Booking.find().populate('tour').populate('user');

  // Create a map of users and their booked tours
  const userBookings = {};
  bookings.forEach((booking) => {
    if (booking.user && booking.tour) {
      if (!userBookings[booking.user.id]) {
        userBookings[booking.user.id] = { user: booking.user, bookedTours: [] };
      }
      userBookings[booking.user.id].bookedTours.push(booking.tour.id);
    }
  });

  console.log('User Bookings:', userBookings);

  const currentUser = userBookings[userId];

  // If the user has no bookings, recommend the most popular tours
  if (!currentUser) {
    const popularTours = await Tour.find()
      .sort({ ratingsAverage: -1 })
      .limit(3);
    return res.status(200).json({
      status: 'success',
      results: popularTours.length,
      data: {
        recommendations: popularTours,
      },
    });
  }

  console.log('Current User Bookings:', currentUser);

  // Calculate similarities between the current user and all other users
  const similarities = Object.values(userBookings).map((user) => ({
    userId: user.user.id,
    similarity: calculateCosineSimilarity(currentUser, user),
  }));

  console.log('Similarities:', similarities);

  // Sort users by similarity in descending order
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Get the top N similar users (e.g., top 5)
  const topSimilarUsers = similarities.slice(0, 5);

  console.log('Top Similar Users:', topSimilarUsers);

  // Collect tours booked by similar users
  const recommendedTours = new Set();
  topSimilarUsers.forEach((similarUser) => {
    const user = userBookings[similarUser.userId];
    user.bookedTours.forEach((tour) => recommendedTours.add(tour));
  });

  console.log(
    'Recommended Tours before removing already booked:',
    recommendedTours,
  );

  // Remove tours already booked by the current user
  currentUser.bookedTours.forEach((tour) => recommendedTours.delete(tour));

  console.log(
    'Recommended Tours after removing already booked:',
    recommendedTours,
  );

  // Fetch tour details from the database
  const recommendedTourDetails = await Tour.find({
    _id: { $in: Array.from(recommendedTours) },
  });

  res.status(200).json({
    status: 'success',
    results: `${recommendedTourDetails.length} recommended tours`,
    data: {
      recommendations: recommendedTourDetails,
    },
  });
};
