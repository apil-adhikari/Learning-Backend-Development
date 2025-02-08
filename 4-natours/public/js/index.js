/*eslint-disable*/
//ENTRY FILE: This file will be watched by bundler and compiled into bundle.js file as output
import '@babel/polyfill';
import { login, logout } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form');
const logoutButton = document.querySelector('.nav__el--logout');

// DELEGATION
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
