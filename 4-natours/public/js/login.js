/*eslint-disable*/
// Using installed axios
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  console.log('LOGIN');
  console.log(email, password);
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (result.data.status === 'success') {
      showAlert('success', 'Logged in successfully😃');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
    console.log(result);
  } catch (error) {
    // console.log(error.response.data);
    // console.log(error.response.data.message);
    showAlert('error', `${error.response.data.message} ☹️`);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });

    if ((result.data.status = 'success')) location.reload(true); // location.reload(true) will reload the data from the server
  } catch (error) {
    console.log(error);
    showAlert('error', 'Error logging out!❌ Try again.');
  }
};
