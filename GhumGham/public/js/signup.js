/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  console.log('SIGNUP');
  console.log(name, email, password, passwordConfirm);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/signup',
      data: {
        name,
        email,

        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully! 🎉');
      window.setTimeout(() => {
        location.assign('/'); // Redirect to home after signup
      }, 3000);
    }
    console.log(res);
  } catch (error) {
    console.log(error);
    showAlert(
      'error',
      `${error.response?.data?.message || 'Signup failed!'} ❌`,
    );
  }
};
