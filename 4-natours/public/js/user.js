import axios from 'axios';
import { showAlert } from './alerts';

export const addUser = async (data) => {
  try {
    // Extract admin credentials from the data
    // const { adminEmail, adminPassword, ...userData } = data;
    const userData = data;

    // Create the new user
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: userData,
    });

    if (response.data.status === 'success') {
      showAlert('success', 'User created successfully!');

      // Log the admin back in
      // const adminResponse = await axios({
      //   method: 'POST',
      //   url: '/api/v1/users/login',
      //   data: {
      //     email: adminEmail,
      //     password: adminPassword,
      //   },
      // });

      // if (adminResponse.data.status === 'success') {
      //   window.setTimeout(() => {
      //     location.assign('/manage-users');
      //   }, 1500);
      // }
    }
  } catch (error) {
    console.log('ERROR IN addUser():', error);
    showAlert('error', 'Failed to create user.');
  }
};

export const updateUser = async (userId, data) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${userId}`,
      data,
    });

    if (response.data.status === 'success') {
      showAlert('success', 'User updated successfully!');
      window.setTimeout(() => {
        location.assign('/manage-users');
      }, 1500);
    }
  } catch (error) {
    console.log('ERROR IN updateUser():', error);
    showAlert('error', 'Failed to update user.');
  }
};

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
