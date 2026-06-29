console.log("JS ÇALIŞIYOR");

const API_KEY = "eb6fe5281c6935ad7c261dd8a59aa902";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("search");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");

async function loadMovies(url){
    const res = await fetch(url);
    const data = await res.json();

    moviesDiv.innerHTML = "";

    data.results.forEach(movie => {
        if(!movie.poster_path) return;

        const div = document.createElement("div");
        div.className = "movie";
        div.dataset.id = movie.id;

        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        `;

        moviesDiv.appendChild(div);
    });
}

// CLICK FIX (EN SAĞLAM YÖNTEM)
moviesDiv.addEventListener("click", async (e) => {
    const card = e.target.closest(".movie");
    if(!card) return;

    const id = card.dataset.id;

    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=tr-TR`);
    const data = await res.json();

    let trailer = data.results.find(v => v.type === "Trailer");

    modalBody.innerHTML = trailer
        ? `<iframe width="100%" height="315"
            src="https://www.youtube.com/embed/${trailer.key}"
            allowfullscreen></iframe>`
        : "<p>Fragman yok</p>";

    modal.style.display = "flex";
});

closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
    if(e.target == modal) modal.style.display = "none";
};

// load initial
loadMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);

// search
searchInput.addEventListener("input", (e) => {
    const q = e.target.value;

    if(q.length > 2){
        loadMovies(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${q}&language=tr-TR`);
    } else {
        loadMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR`);
    }
});
