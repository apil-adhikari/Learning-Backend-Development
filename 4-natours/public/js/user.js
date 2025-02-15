import axios from 'axios';
import { showAlert } from './alerts';

export const deleteUser = async (userId) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `/api/v1/users/${userId}`,
    });

    if (response.status === 204) {
      showAlert('success', 'User deleted successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (error) {
    console.log('ERROR IN deleteUser():', error);
    showAlert('error', 'Failed to delete user.');
  }
};
