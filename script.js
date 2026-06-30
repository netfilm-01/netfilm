const API_KEY = "eb6fe5281c6935ad7c261dd8a59aa902";

/* GENRE MAP */
const GENRES = {
  28: "aksiyon",
  12: "macera",
  16: "animasyon",
  35: "komedi",
  80: "suç",
  99: "belgesel",
  18: "dram",
  14: "fantastik",
  27: "korku",
  878: "bilimkurgu",
  53: "gerilim",
  10749: "romantik"
};

const moviesDiv = document.getElementById("movies");
const topRatedDiv = document.getElementById("toprated");
const favoritesDiv = document.getElementById("favorites");
const featured = document.getElementById("featured");
const searchInput = document.getElementById("search");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");

let favorites = JSON.parse(localStorage.getItem("fav")) || [];

function saveFav(){
    localStorage.setItem("fav", JSON.stringify(favorites));
}

function isFav(id){
    return favorites.includes(id);
}

/* HERO */
function setFeatured(movie){
    featured.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    featured.innerHTML = `<h2>${movie.title}</h2>`;
}

/* RENDER */
function render(container, movies){
    container.innerHTML = "";

    movies.forEach(movie => {
        if(!movie.poster_path) return;

        const div = document.createElement("div");
        div.className = "movie";
        div.dataset.id = movie.id;

        /* GENRE EKLE */
        div.dataset.genre =
            movie.genre_ids && movie.genre_ids.length
                ? GENRES[movie.genre_ids[0]] || "diger"
                : "diger";

        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
            <div class="heart">${isFav(movie.id) ? "❤️" : "🤍"}</div>
        `;

        container.appendChild(div);
    });
}

/* HOME */
async function loadHome(){
    const pop = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);
    const popData = await pop.json();

    const top = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=tr-TR`);
    const topData = await top.json();

    render(moviesDiv, popData.results);
    render(topRatedDiv, topData.results);
    renderFavorites();

    setFeatured(popData.results[0]);
}

/* FAVORITES */
async function renderFavorites(){
    let list = [];

    for(let id of favorites){
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=tr-TR`);
        const data = await res.json();
        list.push(data);
    }

    render(favoritesDiv, list);
}

/* MOVIE MODAL */
async function openMovie(id){
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=tr-TR`);
    const data = await res.json();

    let trailer = data.results.find(v => v.type === "Trailer");

    modalBody.innerHTML = trailer
        ? `<iframe width="100%" height="350"
            src="https://www.youtube.com/embed/${trailer.key}"
            allowfullscreen></iframe>`
        : "<p>Fragman yok</p>";

    modal.style.display = "flex";
}

/* CLICK SYSTEM */
[moviesDiv, topRatedDiv, favoritesDiv].forEach(container => {
    container.addEventListener("click", (e) => {
        const card = e.target.closest(".movie");
        if(!card) return;

        const id = Number(card.dataset.id);

        if(e.target.classList.contains("heart")){
            if(isFav(id)){
                favorites = favorites.filter(f => f !== id);
            }else{
                favorites.push(id);
            }

            saveFav();
            loadHome();
            return;
        }

        openMovie(id);
    });
});

/* CLOSE MODAL */
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
    if(e.target == modal) modal.style.display = "none";
};

/* SEARCH */
searchInput.addEventListener("input", async (e) => {
    const q = e.target.value.trim();

    if(q.length > 2){
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${q}&language=tr-TR`);
        const data = await res.json();

        render(moviesDiv, data.results);
        topRatedDiv.innerHTML = "";
        favoritesDiv.innerHTML = "";
    } else {
        loadHome();
    }
});

/* GENRE FILTER */
function filterGenre(genre) {
    const all = document.querySelectorAll(".movie");

    all.forEach(movie => {
        if (genre === "all") {
            movie.style.display = "block";
        } else {
            movie.style.display =
                movie.dataset.genre === genre ? "block" : "none";
        }
    });
}

/* INIT */
loadHome();
