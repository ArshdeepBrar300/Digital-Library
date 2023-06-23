"use strict";

const signUpForm = document.querySelector("#sign-up-form");

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const passwordField = document.querySelector("#id_password");
  const confirmPasswordField = document.querySelector("#id_confirm_password");

  if (passwordField.value !== confirmPasswordField.value) {
    confirmPasswordField.setCustomValidity("Passwords must match");
  } else {
    confirmPasswordField.setCustomValidity("");
  }

  if (!signUpForm.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
  } else {
    document.location = "/client/home/home.html";
  }

  signUpForm.classList.add("was-validated");
});
