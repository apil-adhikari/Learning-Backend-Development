/*eslint-disable*/

const login = async (email, password) => {
  // console.l
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
      alert('Logged in successfully.');
      window.setTimeout(() => {
        location.assign('/');
      }, 0);
    }
    console.log(result);
  } catch (error) {
    // console.log(error.response.data);
    // console.log(error.response.data.message);
    alert(error.response.data.message);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
