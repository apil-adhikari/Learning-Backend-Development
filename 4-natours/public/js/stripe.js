/* eslint-disable */
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alerts';

// Function to initialize Stripe asynchronously
const getStripe = async () => {
  return await loadStripe(
    'pk_test_51QopIOJrczQDTDiW3623M3wS7fNA6aw85WRFhLde91O6tBAfHIJ8T0LKvhykup7v30vyjvBlIAy8PrXYvAUzM4NI00nkb5KheV',
  );
};

// Function to book a tour using Stripe Checkout
export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`,
    );

    console.log(session);

    // 2) Load Stripe dynamically
    const stripe = await getStripe();

    // 3) Redirect to Stripe Checkout
    const res = await stripe.redirectToCheckout({
      sessionId: session.data.session.id, // Make sure your backend returns this
    });

    // if (res.error) {
    //   console.error(res.error);
    // }
  } catch (error) {
    console.error('Error booking tour:', error);
    showAlert('error', err);
  }
};
