"use strict";

const signInForm = document.querySelector("#sign-in-form");

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!signInForm.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
  } else {
    document.location = "/client/home/home.html";
  }

  signInForm.classList.add("was-validated");
});
