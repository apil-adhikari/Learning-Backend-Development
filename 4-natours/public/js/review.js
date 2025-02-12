import axios from 'axios';
import { showAlert } from './alerts';

export const submitReview = async (tourId, review, rating) => {
  console.log('IN SUBMIT REVIEW');
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/api/v1/reviews`,
      data: { tour: tourId, review, rating },
    });

    console.log(res); // Log the full response

    if (res.data.status === 'success') {
      showAlert('success', 'Review submitted successfully.');
      window.setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    console.log(err); // Log the error
    showAlert(
      'error',
      `${err.response.data.message} || 'Something went wrong.'`,
    );
  }
};

export const updateReview = async (reviewId, review, rating) => {
  console.log(reviewId, review, rating);
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/reviews/${reviewId}`,
      data: { review, rating },
    });
    console.log(res); // Log the full response

    if (res.data.status === 'success') {
      showAlert('success', 'Review updated successfully.');
      window.setTimeout(() => {
        location.reload();
      }, 0);
    }
  } catch (err) {
    console.log(err); // Log the error
    showAlert(
      'error',
      `${err.response.data.message} || 'Something went wrong.'`,
    );
  }
};

export const deleteReview = async (reviewId) => {
  console.log('DELETING REVIEW');
  console.log(reviewId);
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:8000/api/v1/reviews/${reviewId}`,
    });

    console.log(res); // Log the full response

    if (res.status === 204) {
      showAlert('success', 'Review deleted successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 0);
    }
  } catch (err) {
    console.log(err); // Log the error
    showAlert(
      'error',
      `${err.response.data.message} || 'Something went wrong.'`,
    );
  }
};
