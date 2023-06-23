"use strict";

import { playlists } from "./playlist.js";

$(document).ready(function () {
  let purchasedVideos =
    JSON.parse(localStorage.getItem("purchasedVideos")) ?? [];
  playlists.forEach((playlist, index) => {
    displayPlaylist(playlist, index);
    showModal(playlist, index);
  });

  function displayPlaylist(playlist, index) {
    if (purchasedVideos.includes(playlist.name)) {
      const playlistDiv = $(`
        <div class="col-12 col-lg-4">
          <div class="card h-100 my-3" style="background-color:${playlist.bgcolor}; color: ${playlist.color};">

          <div class="card-body">
              <h5 class="card-title display-5">${playlist.name}</h5>
              <p class="card-text">
              ${playlist.description}
              </p>
              <button id="watch-playlist-btn-${index}" type="button" class="btn explore-btn">Watch the Playlist</button>
          </div>
        </div>
      </div>
    `);

      $("#playlist-grid").append(playlistDiv);

      $(`#watch-playlist-btn-${index}`).on("click", () => {
        displayVideos(playlist);
      });
    } else {
      const playlistDiv = $(`
        <div class="col-12 col-lg-4">
          <div class="card h-100 my-3" style="background-color:${playlist.bgcolor}; color: ${playlist.color};">

          <div class="card-body">
              <h5 class="card-title display-5">${playlist.name}</h5>
              <p class="card-text">
              ${playlist.description}
              </p>
              <button id="buy-playlist-btn-${index}" type="button" data-bs-toggle="modal" data-bs-target="#playlist-modal-${index}" class="btn explore-btn">Buy Podcast at $${playlist.price}</button>
          </div>
        </div>
      </div>
    `);

      $("#playlist-grid").append(playlistDiv);
    }
  }

  function showModal(playlist, index) {
    const modalDiv = $(`
            <div class="modal fade" id="playlist-modal-${index}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header" style="background-color:${playlist.bgcolor}; color: ${playlist.color};">
                  <h5 class="modal-title">Buy ${playlist.name}</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body" id="playlist-modal-${index}-body">
                  <h3 class="lead alert alert-success text-center">Make payment of $${playlist.price}</h3>
                  <form id="playlist-modal-${index}-buy-form">
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
                <div class="modal-footer" id="playlist-modal-${index}-footer">
                  <button
                    id="playlist-modal-${index}-close-btn"
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button id="playlist-modal-${index}-buy-btn" type="submit" form="playlist-modal-${index}-buy-form" class="btn btn-primary">
                    Make Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
    `);

    $("#playlist-grid").append(modalDiv);

    $(`#playlist-modal-${index}-buy-form`).on("submit", (e) => {
      e.preventDefault();

      $(`#playlist-modal-${index}-footer`).hide();

      $(`#playlist-modal-${index}-body`).html(`
      <div class="align-items-center d-flex flex-column justify-content-center" style="height:300px;">
        <div class="spinner-border my-4" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <h3 class="display-4 text-center">Processing Payment</h3>
      </div>
      `);
      purchasedVideos.push(playlist.name);
      localStorage.setItem("purchasedVideos", JSON.stringify(purchasedVideos));

      setTimeout(() => {
        $(`#playlist-modal-${index}-close-btn`).click();
        displayVideos(playlist);
      }, 1500);
    });

    return modalDiv;
  }

  function displayVideos(playlist) {
    $("#playlist-grid").hide();

    const episodesDiv = $(`
        <div class="videos">
        <h1 class="text-center display-3">${playlist.name}</h1>
        <div class="my-4 p-5 rounded" style="background-color:${playlist.bgcolor}; color: ${playlist.color};">
          ${playlist.description}
        </div>
        <div id="video" class="d-flex justify-content-center"></div>
      </div>
    `);

    $("#playlist-container").append(episodesDiv);

    const videoDiv = createVideoDiv(
      `${playlist.link}`,
      `playlist-${playlist.name}`
    );

    $("#video").append(videoDiv);
  }

  function createVideoDiv(videolink, id) {
    return $(
      `<iframe width="1100" height="415"
       id="${id}",
       src="${videolink}"
        title="YouTube video player" frameborder="0" allow="accelerometer;
        autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    );
  }
});
