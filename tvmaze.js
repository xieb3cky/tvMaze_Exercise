

/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */



async function searchShows(query) {
    // TODO: Make an ajax request to the searchShows api.  Remove hard coded data.
    const showArr = [];
    const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);

    // imbd "tt1723816"
    // const res = await axios.get('https://api.tvmaze.com/lookup/shows?imdb=tt1723816')

    for (let i of res.data) {

        showArr.push({
            id: i.show.id,
            name: i.show.name,
            image: i.show.image,
            summary: i.show.summary
        })
    }

    return showArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
    const $showsList = $("#shows-list");
    $showsList.empty();

    for (let show of shows) {
        let img = show.image ? show.image.medium : "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";

        let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
                           <div class="card" data-show-id="${show.id}">
                             <div class="card-body">
                               <h5 class="card-title">${show.name}</h5>
                               <img class="card-img-top" src="${img}">
                               <p class="card-text">${show.summary}</p>
                               <button>Show Episodes</button>
                             </div>
                           </div>
                         </div>
                        `);
        $showsList.append($item);
    }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
    evt.preventDefault();

    let query = $("#search-query").val();
    if (!query) return;

    $("#episodes-area").hide();

    let shows = await searchShows(query);

    populateShows(shows);
    $("#search-query").val('');
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
    // TODO: get episodes from tvmaze
    const episodesArr = [];
    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    for (let i of res.data) {
        episodesArr.push({
            id: i.id,
            name: i.name,
            season: i.season,
            numbers: i.number
        })
    }
    // TODO: return array-of-episode-info, as described in docstring above
    return episodesArr;
}


//populate episodes - given episode list add to DOM

function populateEpisodes(episodes) {
    const $epList = $('#episodes-list');
    $epList.empty();

    for (let ep of episodes) {
        let $item = $(`<li>
        ${ep.name}
        (season ${ep.season}, episode ${ep.numbers})
        </li>`)
        $epList.append($item);
    }
    $('#episodes-area').show();
}


$('#shows-list').on('click', 'button', async function handleClickEpisodes(evt) {
    const id = $(this).closest(".Show").data("show-id");
    const episodes = await getEpisodes(id);
    populateEpisodes(episodes);
    $("#shows-list").hide();
})