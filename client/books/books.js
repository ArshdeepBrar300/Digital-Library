"use strict";

import { library } from "./library.js";

$(document).ready(function () {
  let purchasedBooks = JSON.parse(localStorage.getItem("purchasedBooks")) ?? [];

  library.forEach((book, index) => {
    displayLibrary(book, index);
    showModal(book, index);
  });

  function displayLibrary(book, index) {
    if (purchasedBooks.includes(book.name)) {
      const bookDiv = $(`
        <div class="col-12 col-lg-4">
          <div class="card h-100 my-3" style="background-color:${book.bgcolor}; color: ${book.color};">
          
          <div class="card-body">
              <h5 class="card-title display-5">
                ${book.name}
                <h4>By ${book.author}</h4>
              </h5>
              <p class="card-text">
              ${book.description}
              </p>
              <button id="listen-book-btn-${index}" type="button" class="btn explore-btn">Read the book</button>
          </div>
        </div>
      </div>
    `);

      $("#library-grid").append(bookDiv);

      $(`#listen-book-btn-${index}`).on("click", () => {
        displayBook(book);
      });
    } else {
      const bookDiv = $(`
        <div class="col-12 col-lg-4">
          <div class="card h-100 my-3" style="background-color:${book.bgcolor}; color: ${book.color};">
          
          <div class="card-body">
          <h5 class="card-title display-5">
            ${book.name}
            <h4>By ${book.author}</h4>
          </h5>
              <p class="card-text">
              ${book.description}
              </p>
              <button id="buy-book-btn-${index}" type="button" data-bs-toggle="modal" data-bs-target="#book-modal-${index}" class="btn explore-btn">Buy book at $${book.price}</button>
          </div>
        </div>
      </div>
    `);

      $("#library-grid").append(bookDiv);
    }
  }

  function showModal(book, index) {
    const modalDiv = $(`
            <div class="modal fade" id="book-modal-${index}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header" style="background-color:${book.bgcolor}; color: ${book.color};">
                  <h5 class="modal-title">Buy ${book.name}</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body" id="book-modal-${index}-body">
                  <h3 class="lead alert alert-success text-center">Make payment of $${book.price}</h3>
                  <form id="book-modal-${index}-buy-form">
                    <div class="mb-3">
                      <label for="id-card-name" class="form-label"
                        >Cardholder Name</label
                      >
                      <input type="text" class="form-control" id="id-card-name" required/>
                    </div>
                    <div class="mb-3">
                      <label for="id-card-num" class="form-label">Card Number</label>
                      <input type="number" class="form-control" id="id-card-num" required/>
                      <div id="creditCardHelp" class="form-text">
                        We'll never share your information with anyone else.
                      </div>
                    </div>
                    <div class="row">
                      <div class="mb-3 col">
                        <label for="id-card-date" class="form-label"
                          >Expiration Date</label>
                        <input type="date" class="form-control" id="id-card-date" required/>
                      </div>
                      <div class="mb-3 col">
                        <label for="id-card-cvv" class="form-label">CVV</label>
                        <input type="number" max-length="3" class="form-control" id="id-card-cvv" required/>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer" id="book-modal-${index}-footer">
                  <button
                    id="book-modal-${index}-close-btn"
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button id="book-modal-${index}-buy-btn" type="submit" form="book-modal-${index}-buy-form" class="btn btn-primary">
                    Make Payment
                  </button>
                </div>
              </div>
            </div>
          </div> 
    `);

    $("#library-grid").append(modalDiv);

    $(`#book-modal-${index}-buy-form`).on("submit", (e) => {
      e.preventDefault();

      $(`#book-modal-${index}-footer`).hide();

      $(`#book-modal-${index}-body`).html(`
      <div class="align-items-center d-flex flex-column justify-content-center" style="height:300px;">
        <div class="spinner-border my-4" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <h3 class="display-4 text-center">Processing Payment</h3>
      </div>
      `);

      purchasedBooks.push(book.name);
      localStorage.setItem("purchasedBooks", JSON.stringify(purchasedBooks));

      setTimeout(() => {
        $(`#book-modal-${index}-close-btn`).click();
        displayBook(book);
      }, 1500);
    });

    return modalDiv;
  }

  function displayBook(book) {
    $("#library-grid").hide();

    const bookDiv = $(`
        <div class="book">
        <h1 class="text-center display-3">
          ${book.name}
          <h4 class="text-center">By ${book.author}</h4>
        </h1>
        <div class="my-4 p-5 rounded" style="background-color:${book.bgcolor}; color: ${book.color};">
          ${book.description}
        </div>
        <div id="pdf-container" class="mx-auto w-75 d-flex justify-content-center mx-auto w-75"></div>
      </div>
    `);

    $("#book-container").append(bookDiv);

    const pdfDiv = createBookDiv(book.src);

    $("#pdf-container").append(pdfDiv);
  }

  function createBookDiv(bookSrc) {
    return $(`
      <iframe
        src="https://docs.google.com/gview?url=${bookSrc}&embedded=true"
        style="width: 800px; height: 1000px"
        frameborder="0"
      ></iframe>
    `);
  }
});
