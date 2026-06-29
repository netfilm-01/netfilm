const API_KEY = "eb6fe5281c6935ad7c261dd8a59aa902";
const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

function formatVote(vote){
    return vote ? vote.toFixed(1) : "0.0";
}

// Film yükleme fonksiyonu
async function loadMovies(url){
    try {
        const res = await fetch(url);
        const data = await res.json();

        moviesDiv.innerHTML = "";

        data.results.forEach(movie => {
            if(!movie.poster_path) return;

            moviesDiv.innerHTML += `
            <div class="movie">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                <h3>${movie.title}</h3>
                <p>⭐ ${formatVote(movie.vote_average)}</p>
            </div>
            `;
        });

    } catch (error) {
        console.error("Hata:", error);
        moviesDiv.innerHTML = "<p>Filmler yüklenemedi</p>";
    }
}

// İlk açılış
loadMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);

// 🔍 ARAMA (EN KRİTİK KISIM)
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();

    if(query.length > 2){
        loadMovies(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=tr-TR`);
    } else {
        loadMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);
    }
});
