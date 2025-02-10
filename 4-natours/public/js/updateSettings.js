/* eslint-disable */
import axiox from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  try {
    const result = await axiox({
      method: 'PATCH',
      url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Data updated successfully.');
    }
  } catch (error) {
    console.log('Error updating ');
    showAlert('error', error.response.data.message);
  }
};
