const API_KEY = "eb6fe5281c6935ad7c261dd8a59aa902";

/* ========= CONTAINERS ========= */

const featured = document.getElementById("featured");

const popularDiv = document.getElementById("popular");
const actionDiv = document.getElementById("action");
const fantasyDiv = document.getElementById("fantasy");
const comedyDiv = document.getElementById("comedy");
const horrorDiv = document.getElementById("horror");
const scifiDiv = document.getElementById("scifi");

const topRatedDiv = document.getElementById("toprated");
const favoritesDiv = document.getElementById("favorites");
const searchResultsDiv = document.getElementById("searchResults");

const secSearch = document.getElementById("sec-search");
const browseSections = [
    "sec-popular","sec-action","sec-fantasy",
    "sec-comedy","sec-horror","sec-scifi",
    "sec-toprated","sec-favorites"
].map(id => document.getElementById(id));

const searchInput = document.getElementById("search");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");

/* ========= FAVORITES ========= */

let favorites = JSON.parse(localStorage.getItem("fav")) || [];

function saveFav(){
    localStorage.setItem("fav", JSON.stringify(favorites));
}

function isFav(id){
    return favorites.includes(id);
}

/* ========= SAFE FETCH ========= */
// Ağ hatalarında / API limit aşımında sayfanın çökmesini engeller

async function safeFetch(url){

    try{

        const res = await fetch(url);

        if(!res.ok){
            console.error("API hatası:", res.status, url);
            return null;
        }

        return await res.json();

    }catch(err){
        console.error("Bağlantı hatası:", err);
        return null;
    }

}

/* ========= HERO ========= */

function setFeatured(movie){

    if(!movie || !movie.backdrop_path){
        featured.innerHTML = "";
        featured.style.backgroundImage = "";
        return;
    }

    featured.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    featured.innerHTML = `
        <h2>${movie.title}</h2>
    `;
}

/* ========= RENDER ========= */

function render(container, movies){

    container.innerHTML = "";

    if(!movies || movies.length === 0){
        container.innerHTML = "<p class='empty-msg'>Sonuç bulunamadı.</p>";
        return;
    }

    movies.forEach(movie=>{

        if(!movie.poster_path) return;

        const card = document.createElement("div");

        card.className="movie";

        card.dataset.id=movie.id;

        card.innerHTML=`
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "—"}</p>
            <div class="heart">
                ${isFav(movie.id) ? "❤️":"🤍"}
            </div>
        `;

        container.appendChild(card);

    });

}

/* ========= LOAD CATEGORY ========= */

async function loadCategory(container, genre){

    const data = await safeFetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=tr-TR&with_genres=${genre}`
    );

    render(container, data ? data.results : []);

}

/* ========= HOME ========= */

async function loadHome(){

    // Popüler
    const popularData = await safeFetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`
    );

    render(popularDiv, popularData ? popularData.results : []);

    if(popularData && popularData.results.length){
        setFeatured(popularData.results[0]);
    }

    // Türler
    await Promise.all([
        loadCategory(actionDiv,28),      // Aksiyon
        loadCategory(fantasyDiv,14),     // Fantastik
        loadCategory(comedyDiv,35),      // Komedi
        loadCategory(horrorDiv,27),      // Korku
        loadCategory(scifiDiv,878)       // Bilim Kurgu
    ]);

    // En çok oy alanlar
    const topData = await safeFetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=tr-TR`
    );

    render(topRatedDiv, topData ? topData.results : []);

    renderFavorites();

}

/* ========= FAVORITES ========= */

async function renderFavorites(){

    if(favorites.length===0){
        favoritesDiv.innerHTML="<p class='empty-msg'>Henüz favori film eklemedin.</p>";
        return;
    }

    const movies = (await Promise.all(
        favorites.map(id =>
            safeFetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=tr-TR`)
        )
    )).filter(Boolean);

    render(favoritesDiv, movies);

}

/* ========= FAVORITE TOGGLE (sayfayı yeniden yüklemeden) ========= */

function toggleFavorite(id, heartEl){

    if(isFav(id)){
        favorites = favorites.filter(f => f !== id);
    }else{
        favorites.push(id);
    }

    saveFav();

    // Sadece tıklanan kalbi güncelle
    if(heartEl){
        heartEl.textContent = isFav(id) ? "❤️" : "🤍";
    }

    // Tüm sayfadaki aynı filmin kalp ikonlarını senkronla
    document.querySelectorAll(`.movie[data-id="${id}"] .heart`).forEach(h=>{
        h.textContent = isFav(id) ? "❤️" : "🤍";
    });

    // Favoriler bölümünü güncelle
    renderFavorites();

}

/* ========= TRAILER / DETAY ========= */

async function openMovie(id){

    const data = await safeFetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=tr-TR`
    );

    const trailer = data && data.results
        ? data.results.find(v=>v.type==="Trailer")
        : null;

    modalBody.innerHTML = trailer
        ? `
        <iframe
            width="100%"
            height="420"
            src="https://www.youtube.com/embed/${trailer.key}"
            allowfullscreen>
        </iframe>`
        : "<h2>Fragman bulunamadı.</h2>";

    modal.style.display="flex";

}

/* ========= CLICK SYSTEM ========= */

[
    popularDiv,
    actionDiv,
    fantasyDiv,
    comedyDiv,
    horrorDiv,
    scifiDiv,
    topRatedDiv,
    favoritesDiv,
    searchResultsDiv
].forEach(container => {

    container.addEventListener("click",(e)=>{

        const card=e.target.closest(".movie");

        if(!card) return;

        const id=Number(card.dataset.id);

        // ❤️ FAVORİ
        if(e.target.classList.contains("heart")){
            toggleFavorite(id, e.target);
            return;
        }

        // 🎬 MODAL
        openMovie(id);

    });

});

/* ========= SEARCH (debounce ile) ========= */

let searchTimeout = null;

function showBrowseMode(){
    secSearch.style.display = "none";
    browseSections.forEach(s => s.style.display = "");
}

function showSearchMode(){
    secSearch.style.display = "";
    browseSections.forEach(s => s.style.display = "none");
}

async function runSearch(q){

    const data = await safeFetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=tr-TR&query=${encodeURIComponent(q)}`
    );

    render(searchResultsDiv, data ? data.results : []);

}

searchInput.addEventListener("input",(e)=>{

    const q = e.target.value.trim();

    clearTimeout(searchTimeout);

    if(q.length < 2){
        showBrowseMode();
        return;
    }

    showSearchMode();

    // 400ms boyunca yazmayı bekle, sonra istek at (debounce)
    searchTimeout = setTimeout(()=>{
        runSearch(q);
    }, 400);

});

/* ========= MODAL ========= */

closeBtn.onclick=()=>{
    modal.style.display="none";
};

window.onclick=(e)=>{
    if(e.target===modal){
        modal.style.display="none";
    }
};

/* ========= INIT ========= */

loadHome();
