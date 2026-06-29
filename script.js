const API_KEY = "eb6fe5281c6935ad7c261dd8a59aa902";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

// Film yaz
function renderMovies(movies){
    moviesDiv.innerHTML = "";

    movies.forEach(movie => {
        if(!movie.poster_path) return;

        moviesDiv.innerHTML += `
        <div class="movie">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        </div>
        `;
    });
}

// API çağır
async function fetchMovies(url){
    try{
        const res = await fetch(url);
        const data = await res.json();
        renderMovies(data.results);
    }catch(err){
        console.log("Hata:", err);
        moviesDiv.innerHTML = "<p>Filmler yüklenemedi</p>";
    }
}

// İlk açılış (popüler filmler)
fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);

// Arama sistemi
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();

    if(query.length > 2){
        fetchMovies(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=tr-TR`);
    } else {
        fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);
    }
});
