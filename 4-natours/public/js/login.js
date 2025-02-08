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
