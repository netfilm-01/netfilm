const API_KEY = "eb6fe5281c6935ad7c261dd8a59aa902";

const movies = document.getElementById("movies");

async function loadMovies(){

const res = await fetch(
`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=tr-TR&page=1`
);

const data = await res.json();

movies.innerHTML="";

data.results.forEach(movie=>{

movies.innerHTML+=`
<div class="movie">

<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">

<h3>${movie.title}</h3>

<p>⭐ ${movie.vote_average}</p>

</div>
`;

});

}

loadMovies();
