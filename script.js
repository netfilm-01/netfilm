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

/* ========= HERO ========= */

function setFeatured(movie){

    featured.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    featured.innerHTML = `
        <h2>${movie.title}</h2>
    `;
}

/* ========= RENDER ========= */

function render(container,movies){

    container.innerHTML = "";

    movies.forEach(movie=>{

        if(!movie.poster_path) return;

        const card = document.createElement("div");

        card.className="movie";

        card.dataset.id=movie.id;

        card.innerHTML=`
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
            <div class="heart">
                ${isFav(movie.id) ? "❤️":"🤍"}
            </div>
        `;

        container.appendChild(card);

    });

}

/* ========= LOAD CATEGORY ========= */

async function loadCategory(container,genre){

    const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=tr-TR&with_genres=${genre}`
    );

    const data = await res.json();

    render(container,data.results);

}
/* ========= HOME ========= */

async function loadHome(){

    // Popüler
    const popularRes = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`
    );

    const popularData = await popularRes.json();

    render(popularDiv,popularData.results);

    if(popularData.results.length){
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
    const topRes = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=tr-TR`
    );

    const topData = await topRes.json();

    render(topRatedDiv,topData.results);

    renderFavorites();

}

/* ========= FAVORITES ========= */

async function renderFavorites(){

    favoritesDiv.innerHTML="";

    if(favorites.length===0){
        favoritesDiv.innerHTML="<p>Henüz favori film eklemedin.</p>";
        return;
    }

    const movies=[];

    for(const id of favorites){

        const res=await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=tr-TR`
        );

        movies.push(await res.json());

    }

    render(favoritesDiv,movies);

}

/* ========= TRAILER ========= */

async function openMovie(id){

    const res=await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=tr-TR`
    );

    const data=await res.json();

    const trailer=data.results.find(v=>v.type==="Trailer");

    modalBody.innerHTML=trailer
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
    favoritesDiv
].forEach(container => {

    container.addEventListener("click",(e)=>{

        const card=e.target.closest(".movie");

        if(!card) return;

        const id=Number(card.dataset.id);

        // ❤️ FAVORİ
        if(e.target.classList.contains("heart")){

            if(isFav(id)){
                favorites=favorites.filter(f=>f!==id);
            }else{
                favorites.push(id);
            }

            saveFav();

            loadHome();

            return;
        }

        // 🎬 MODAL
        openMovie(id);

    });

});


/* ========= SEARCH ========= */

searchInput.addEventListener("input",async(e)=>{

    const q=e.target.value.trim();

    if(q.length<2){

        loadHome();

        return;

    }

    const res=await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=tr-TR&query=${encodeURIComponent(q)}`
    );

    const data=await res.json();

    render(popularDiv,data.results);

    actionDiv.innerHTML="";
    fantasyDiv.innerHTML="";
    comedyDiv.innerHTML="";
    horrorDiv.innerHTML="";
    scifiDiv.innerHTML="";
    topRatedDiv.innerHTML="";
    favoritesDiv.innerHTML="";

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
