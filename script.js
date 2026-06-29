const API_KEY = "eb6fe5281c6935ad7c261dd8a59aa902";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");

let moviesData = [];

// 🎬 render
function renderMovies(movies){
    moviesData = movies;

    moviesDiv.innerHTML = "";

    movies.forEach(movie => {
        if(!movie.poster_path) return;

        moviesDiv.innerHTML += `
        <div class="movie" data-id="${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        </div>
        `;
    });
}

// 🎬 detay + fragman
async function openMovie(id){

    const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=tr-TR`);
    const movie = await movieRes.json();

    const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=tr-TR`);
    const videoData = await videoRes.json();

    let trailer = videoData.results.find(v => v.type === "Trailer");

    let trailerHTML = trailer
        ? `<iframe width="100%" height="315"
            src="https://www.youtube.com/embed/${trailer.key}"
            frameborder="0" allowfullscreen></iframe>`
        : "<p>Fragman bulunamadı 😢</p>";

    modalBody.innerHTML = `
        <h2>${movie.title}</h2>
        <p>⭐ ${movie.vote_average}</p>
        <p>${movie.overview || "Açıklama yok."}</p>
        <h3>🎬 Fragman</h3>
        ${trailerHTML}
    `;

    modal.style.display = "flex";
}

// 🖱️ EVENT DELEGATION (ASIL ÇÖZÜM)
moviesDiv.addEventListener("click", (e) => {
    const card = e.target.closest(".movie");
    if(!card) return;

    const id = card.getAttribute("data-id");
    openMovie(id);
});

// ❌ modal kapat
closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
    if(e.target == modal){
        modal.style.display = "none";
    }
};

// 🌐 yükleme
async function loadMovies(){
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);
    const data = await res.json();
    renderMovies(data.results);
}

loadMovies();

// 🔍 arama
searchInput.addEventListener("input", async (e) => {
    const q = e.target.value.trim();

    if(q.length > 2){
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${q}&language=tr-TR`);
        const data = await res.json();
        renderMovies(data.results);
    } else {
        loadMovies();
    }
});
