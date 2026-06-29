const API_KEY = "eb6fe5281c6935ad7c261dd8a59aa902";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

// modal
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");

function renderMovies(movies){
    moviesDiv.innerHTML = "";

    movies.forEach(movie => {
        if(!movie.poster_path) return;

        moviesDiv.innerHTML += `
        <div class="movie" onclick="openMovie(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        </div>
        `;
    });
}

// 🎬 film aç + fragman getir
async function openMovie(id){

    // film bilgisi
    const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=tr-TR`);
    const movie = await movieRes.json();

    // video (fragman)
    const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=tr-TR`);
    const videoData = await videoRes.json();

    let trailer = videoData.results.find(v => v.type === "Trailer");

    let trailerHTML = "";

    if(trailer){
        trailerHTML = `
        <iframe width="100%" height="315"
        src="https://www.youtube.com/embed/${trailer.key}"
        frameborder="0"
        allowfullscreen></iframe>
        `;
    } else {
        trailerHTML = "<p>Fragman bulunamadı 😢</p>";
    }

    modalBody.innerHTML = `
        <h2>${movie.title}</h2>
        <p>⭐ ${movie.vote_average}</p>
        <p>${movie.overview || "Açıklama yok."}</p>
        <br>
        <h3>🎬 Fragman</h3>
        ${trailerHTML}
    `;

    modal.style.display = "flex";
}

// kapat
closeBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e) => {
    if(e.target == modal){
        modal.style.display = "none";
    }
};

// ilk yükleme
async function loadMovies(){
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);
    const data = await res.json();
    renderMovies(data.results);
}

loadMovies();

// arama
searchInput.addEventListener("input", async (e) => {
    const q = e.target.value;

    if(q.length > 2){
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${q}&language=tr-TR`);
        const data = await res.json();
        renderMovies(data.results);
    } else {
        loadMovies();
    }
});
