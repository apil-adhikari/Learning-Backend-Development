/*eslint-disable*/
// ENTRY FILE: This file will be watched by bundler and compiled into bundle.js file as output
import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup'); // For signup form
const logoutButton = document.querySelector('.nav__el--logout');

// DELEGATION
// Login Form
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// SIGNUP FORM SUBMISSION
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, photo, role, password, passwordConfirm);
  });
}

// Logout Button
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
