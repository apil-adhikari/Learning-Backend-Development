/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { submitReview, updateReview, deleteReview } from './review';
import { addTour, updateTour, deleteTour } from './tour';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookButton = document.getElementById('book-tour');
const reviewForm = document.querySelector('#review-form');
const submitBtn = document.querySelector('#submit-review');
const updateBtn = document.querySelector('#update-review');
const deleteBtn = document.querySelector('#delete-review');
const addTourForm = document.querySelector('.form--add-tour');
const updateTourForm = document.querySelector('.form--update-tour');
const deleteTourButtons = document.querySelectorAll('.btn--delete-tour');

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

// Signup Form
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

// Logout Button
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

// Update Current User Data
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookButton) {
  bookButton.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

// Review Form Submission
if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tourId = reviewForm.dataset.tourId;
    const review = document.getElementById('review-text').value;
    const rating = document.getElementById('review-rating').value;

    // Determine which button was clicked
    if (e.submitter.id === 'submit-review') {
      await submitReview(tourId, review, rating);
    } else if (e.submitter.id === 'update-review') {
      const reviewId = e.submitter.dataset.reviewId;
      await updateReview(reviewId, review, rating);
    }
  });
}

if (updateBtn) {
  updateBtn.addEventListener('click', async () => {
    const reviewId = updateBtn.dataset.reviewId;
    const review = document.querySelector('#review-text').value;
    const rating = document.querySelector('#review-rating').value;
    updateReview(reviewId, review, rating);
  });
}

if (deleteBtn) {
  deleteBtn.addEventListener('click', async () => {
    const reviewId = deleteBtn.dataset.reviewId;
    deleteReview(reviewId);
  });
}

if (addTourForm) {
  addTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await addTour(addTourForm);
  });
}

if (updateTourForm) {
  updateTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateTour(updateTourForm);
  });
}

// Delete Tour
if (deleteTourButtons) {
  deleteTourButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const tourId = e.target.dataset.tourId;
      if (tourId) {
        await deleteTour(tourId);
      }
    });
  });
}
