const API_KEY = "eb6fe5281c6935ad7c261dd8a59aa902";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

// MODAL
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");

// 🎬 Film listeleme
function renderMovies(movies){
    moviesDiv.innerHTML = "";

    movies.forEach(movie => {
        if(!movie.poster_path) return;

        moviesDiv.innerHTML += `
        <div class="movie" onclick="showDetails(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        </div>
        `;
    });
}

// 🌐 API çağırma
async function fetchMovies(url){
    try{
        const res = await fetch(url);
        const data = await res.json();
        renderMovies(data.results);
    }catch(err){
        console.log(err);
        moviesDiv.innerHTML = "<p>Filmler yüklenemedi</p>";
    }
}

// 🔥 İlk açılış
fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);

// 🔍 Arama
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();

    if(query.length > 2){
        fetchMovies(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=tr-TR`);
    } else {
        fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);
    }
});

// 🎬 Film detay
async function showDetails(id){
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=tr-TR`);
    const movie = await res.json();

    modalBody.innerHTML = `
        <h2>${movie.title}</h2>
        <p>⭐ ${movie.vote_average}</p>
        <p>${movie.overview || "Açıklama yok."}</p>
    `;

    modal.style.display = "flex";
}

// ❌ kapat
closeBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e) => {
    if(e.target == modal){
        modal.style.display = "none";
    }
};
