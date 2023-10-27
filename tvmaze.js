"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  const shows = res.data;
  return shows.map(function (result) {
    const show = result.show;
    if (show.image === null) {
      return {
        id: show.id,
        name: show.name,
        summary: show.summary,
        image:
          "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300",
      };
    } else {
      return {
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: show.image.medium,
      };
    }
  });
}

/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
       <div class="media">
         <img
            src=${show.image}
            alt=""
            class="w-25 me-3">
         <div class="media-body">
           <h5 class="text-primary">${show.name}</h5>
           <div><small>${show.summary}</small></div>
           <button class="btn btn-outline-light btn-sm Show-getEpisodes">
             Episodes
           </button>
         </div>
       </div>
     </div>
    `
    );
    $showsList.append($show);
  }
}
/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

async function getEpisodesOfShow(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = res.data;
  populateEpisodes(episodes);
}

/** Write a clear docstring for this function... */
function populateEpisodes(episodes) {
  $episodesList.empty();
  for (let episode of episodes) {
    const $episode = $(
      `<li data-episode-id="${episode.id}"> 
      ${episode.name} (season ${episode.season}, number ${episode.number})
      </li>`
    );
    $episodesList.append($episode);
  }
}

$showsList.on("click", ".Show-getEpisodes", async function (e) {
  e.preventDefault();
  const showID = e.target.closest(".Show").getAttribute("data-show-id");
  await getEpisodesOfShow(showID);
  $episodesArea.show();
});
