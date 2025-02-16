import axios from 'axios';
import { showAlert } from './alerts';

export const updateReviewByAdmin = async (reviewId, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/reviews/${reviewId}`,
      data,
    });

    console.log(res); // Log the full response

    if (res.data.status === 'success') {
      showAlert('success', 'Review updated successfully.');
      window.setTimeout(() => {
        location.assign('/manage-reviews');
      }, 1500);
    }
  } catch (err) {
    console.log(err); // Log the error
    showAlert(
      'error',
      `${err.response.data.message} || 'Something went wrong.'`,
    );
  }
};

export const deleteReviewByAdmin = async (reviewId) => {
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
      }, 1500);
    }
  } catch (err) {
    console.log(err); // Log the error
    showAlert(
      'error',
      `${err.response.data.message} || 'Something went wrong.'`,
    );
  }
};
