"use strict";

import { podcasts } from "./podcast.js";

$(document).ready(function () {
  let purchasedAudios =
    JSON.parse(localStorage.getItem("purchasedAudios")) ?? [];

  podcasts.forEach((podcast, index) => {
    displayPodcast(podcast, index);
    showModal(podcast, index);
  });

  function displayPodcast(podcast, index) {
    if (purchasedAudios.includes(podcast.name)) {
      const podcastDiv = $(`
        <div class="col-12 col-lg-4">
          <div class="card h-100 my-3" style="background-color:${podcast.bgcolor}; color: ${podcast.color};">
          
          <div class="card-body">
              <h5 class="card-title display-5">${podcast.name}</h5>
              <p class="card-text">
              ${podcast.description}
              </p>
              <button id="listen-podcast-btn-${index}" type="button" class="btn explore-btn">Listen To Podcast</button>
          </div>
        </div>
      </div>
    `);

      $("#podcast-grid").append(podcastDiv);

      $(`#listen-podcast-btn-${index}`).on("click", () => {
        displayEpisodes(podcast);
      });
    } else {
      const podcastDiv = $(`
        <div class="col-12 col-lg-4">
          <div class="card h-100 my-3" style="background-color:${podcast.bgcolor}; color: ${podcast.color};">
          
          <div class="card-body">
              <h5 class="card-title display-5">${podcast.name}</h5>
              <p class="card-text">
              ${podcast.description}
              </p>
              <button id="buy-podcast-btn-${index}" type="button" data-bs-toggle="modal" data-bs-target="#podcast-modal-${index}" class="btn explore-btn">Buy Podcast at $${podcast.price}</button>
          </div>
        </div>
      </div>
    `);

      $("#podcast-grid").append(podcastDiv);
    }
  }

  function showModal(podcast, index) {
    const modalDiv = $(`
            <div class="modal fade" id="podcast-modal-${index}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header" style="background-color:${podcast.bgcolor}; color: ${podcast.color};">
                  <h5 class="modal-title">Buy ${podcast.name}</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body" id="podcast-modal-${index}-body">
                  <h3 class="lead alert alert-success text-center">Make payment of $${podcast.price}</h3>
                  <form id="podcast-modal-${index}-buy-form">
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
                <div class="modal-footer" id="podcast-modal-${index}-footer">
                  <button
                    id="podcast-modal-${index}-close-btn"
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button id="podcast-modal-${index}-buy-btn" type="submit" form="podcast-modal-${index}-buy-form" class="btn btn-primary">
                    Make Payment
                  </button>
                </div>
              </div>
            </div>
          </div> 
    `);

    $("#podcast-grid").append(modalDiv);

    $(`#podcast-modal-${index}-buy-form`).on("submit", (e) => {
      e.preventDefault();

      $(`#podcast-modal-${index}-footer`).hide();

      $(`#podcast-modal-${index}-body`).html(`
      <div class="align-items-center d-flex flex-column justify-content-center" style="height:300px;">
        <div class="spinner-border my-4" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <h3 class="display-4 text-center">Processing Payment</h3>
      </div>
      `);

      purchasedAudios.push(podcast.name);
      localStorage.setItem("purchasedAudios", JSON.stringify(purchasedAudios));

      setTimeout(() => {
        $(`#podcast-modal-${index}-close-btn`).click();
        displayEpisodes(podcast);
      }, 1500);
    });

    return modalDiv;
  }

  function displayEpisodes(podcast) {
    $("#podcast-grid").hide();

    const episodesDiv = $(`
        <div class="episodes">
        <h1 class="text-center display-3">${podcast.name}</h1>
        <div class="my-4 p-5 rounded" style="background-color:${podcast.bgcolor}; color: ${podcast.color};">
          ${podcast.description}
        </div>
        <div id="episodes-list" class="mx-auto w-75"></div>
      </div>
    `);

    $("#episodes-container").append(episodesDiv);

    podcast.episodes.forEach((episodeLink, index) => {
      const episodeDiv = createEpisodeDiv(
        episodeLink,
        `${podcast.name}-episode-${index}`
      );

      $("#episodes-list").append(episodeDiv);
    });
  }

  function createEpisodeDiv(episodeLink, id) {
    return $(`
      <iframe
          class="my-4"
          id=${id}
          src="${episodeLink}"
          width="100%"
          height="232"
          frameborder="0"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        ></iframe>
    `);
  }
});
