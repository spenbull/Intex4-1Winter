using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieINTEX.Data;
using MovieINTEX.Models;

namespace MovieINTEX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MovieController : ControllerBase
    {
        private MovieDbContext _movieContext;

        public MovieController(MovieDbContext temp)
        {
            _movieContext = temp;
        }

        // Get movies with pagination
[HttpGet("GetMovies")]
public IActionResult GetMoviesPaged(
    int pageSize = 10, 
    int pageNum = 1, 
    [FromQuery] List<string>? genreList = null, 
    [FromQuery] string? search = null)
{
    var query = _movieContext.movies_titles.AsQueryable();

    // Handle search filter (case-insensitive, null-safe)
    if (!string.IsNullOrWhiteSpace(search))
    {
        var trimmedSearch = search.Trim().ToLower();
        query = query.Where(m => m.title != null && m.title.ToLower().StartsWith(trimmedSearch));
    }

    // Handle genre filters
    if (genreList != null && genreList.Any())
    {
        foreach (var genre in genreList)
        {
            switch (genre)
            {
                case "Action":
                    query = query.Where(p => p.Action);
                    break;
                case "Adventure":
                    query = query.Where(p => p.Adventure);
                    break;
                case "Anime Series International TV Shows":
                    query = query.Where(p => p.AnimeSeriesInternationalTVShows);
                    break;
                case "British TV Shows Docuseries International TV Shows":
                    query = query.Where(p => p.BritishTVShowsDocuseriesInternationalTVShows);
                    break;
                case "Children":
                    query = query.Where(p => p.Children);
                    break;
                case "Comedies":
                    query = query.Where(p => p.Comedies);
                    break;
                case "Comedies Dramas International Movies":
                    query = query.Where(p => p.ComediesDramasInternationalMovies);
                    break;
                case "Comedies International Movies":
                    query = query.Where(p => p.ComediesInternationalMovies);
                    break;
                case "Comedies Romantic Movies":
                    query = query.Where(p => p.ComediesRomanticMovies);
                    break;
                case "Crime TV Shows Docuseries":
                    query = query.Where(p => p.CrimeTVShowsDocuseries);
                    break;
                case "Documentaries":
                    query = query.Where(p => p.Documentaries);
                    break;
                case "Documentaries International Movies":
                    query = query.Where(p => p.DocumentariesInternationalMovies);
                    break;
                case "Docuseries":
                    query = query.Where(p => p.Docuseries);
                    break;
                case "Dramas":
                    query = query.Where(p => p.Dramas);
                    break;
                case "Dramas International Movies":
                    query = query.Where(p => p.DramasInternationalMovies);
                    break;
                case "Dramas Romantic Movies":
                    query = query.Where(p => p.DramasRomanticMovies);
                    break;
                case "Family Movies":
                    query = query.Where(p => p.FamilyMovies);
                    break;
                case "Fantasy":
                    query = query.Where(p => p.Fantasy);
                    break;
                case "Horror Movies":
                    query = query.Where(p => p.HorrorMovies);
                    break;
                case "International Movies Thrillers":
                    query = query.Where(p => p.InternationalMoviesThrillers);
                    break;
                case "International TV Shows Romantic TV Shows TV Dramas":
                    query = query.Where(p => p.InternationalTVShowsRomanticTVShowsTVDramas);
                    break;
                case "Kids' TV":
                    query = query.Where(p => p.KidsTV);
                    break;
                case "Language TV Shows":
                    query = query.Where(p => p.LanguageTVShows);
                    break;
                case "Musicals":
                    query = query.Where(p => p.Musicals);
                    break;
                case "Nature TV":
                    query = query.Where(p => p.NatureTV);
                    break;
                case "Reality TV":
                    query = query.Where(p => p.RealityTV);
                    break;
                case "Spirituality":
                    query = query.Where(p => p.Spirituality);
                    break;
                case "TV Action":
                    query = query.Where(p => p.TVAction);
                    break;
                case "TV Comedies":
                    query = query.Where(p => p.TVComedies);
                    break;
                case "TV Dramas":
                    query = query.Where(p => p.TVDramas);
                    break;
                case "Talk Shows TV Comedies":
                    query = query.Where(p => p.TalkShowsTVComedies);
                    break;
                case "Thrillers":
                    query = query.Where(p => p.Thrillers);
                    break;
                default:
                    break;
            }
        }
    }

    var totalNumMovies = query.Count();

    var movies = query
        .Skip((pageNum - 1) * pageSize)
        .Take(pageSize)
        .ToList();

    return Ok(new
    {
        movies = movies,
        totalNumMovies = totalNumMovies
    });
}


        
     [HttpGet("GetGenres")]
    public IActionResult GetGenres()
{
    // Create a list to hold the genre names
    var genreList = new List<string>();

    // Iterate through each movie title and add genres based on the boolean flags
    foreach (var movie in _movieContext.movies_titles)
    {
        if (movie.Action) genreList.Add("Action");
        if (movie.Adventure) genreList.Add("Adventure");
        if (movie.AnimeSeriesInternationalTVShows) genreList.Add("Anime Series International TV Shows");
        if (movie.BritishTVShowsDocuseriesInternationalTVShows) genreList.Add("British TV Shows Docuseries International TV Shows");
        if (movie.Children) genreList.Add("Children");
        if (movie.Comedies) genreList.Add("Comedies");
        if (movie.ComediesDramasInternationalMovies) genreList.Add("Comedies Dramas International Movies");
        if (movie.ComediesInternationalMovies) genreList.Add("Comedies International Movies");
        if (movie.ComediesRomanticMovies) genreList.Add("Comedies Romantic Movies");
        if (movie.CrimeTVShowsDocuseries) genreList.Add("Crime TV Shows Docuseries");
        if (movie.Documentaries) genreList.Add("Documentaries");
        if (movie.DocumentariesInternationalMovies) genreList.Add("Documentaries International Movies");
        if (movie.Docuseries) genreList.Add("Docuseries");
        if (movie.Dramas) genreList.Add("Dramas");
        if (movie.DramasInternationalMovies) genreList.Add("Dramas International Movies");
        if (movie.DramasRomanticMovies) genreList.Add("Dramas Romantic Movies");
        if (movie.FamilyMovies) genreList.Add("Family Movies");
        if (movie.Fantasy) genreList.Add("Fantasy");
        if (movie.HorrorMovies) genreList.Add("Horror Movies");
        if (movie.InternationalMoviesThrillers) genreList.Add("International Movies Thrillers");
        if (movie.InternationalTVShowsRomanticTVShowsTVDramas) genreList.Add("International TV Shows Romantic TV Shows TV Dramas");
        if (movie.KidsTV) genreList.Add("Kids' TV");
        if (movie.LanguageTVShows) genreList.Add("Language TV Shows");
        if (movie.Musicals) genreList.Add("Musicals");
        if (movie.NatureTV) genreList.Add("Nature TV");
        if (movie.RealityTV) genreList.Add("Reality TV");
        if (movie.Spirituality) genreList.Add("Spirituality");
        if (movie.TVAction) genreList.Add("TV Action");
        if (movie.TVComedies) genreList.Add("TV Comedies");
        if (movie.TVDramas) genreList.Add("TV Dramas");
        if (movie.TalkShowsTVComedies) genreList.Add("Talk Shows TV Comedies");
        if (movie.Thrillers) genreList.Add("Thrillers");
    }

    // Remove duplicates and return the result
    var distinctGenres = genreList.Distinct().ToList();
    return Ok(distinctGenres);
}



        // Get all ratings
        [HttpGet("GetRatings")]
        public IActionResult GetRatings()
        {
            var ratings = _movieContext.movies_ratings.ToList();
            return Ok(ratings);
        }

        // Get all users
        [HttpGet("GetUsers")]
        public IActionResult GetUsers()
        {
            var users = _movieContext.movies_users.ToList();
            return Ok(users);
        }

        // Get a single movie by show_id
        [HttpGet("GetMovie/{id}")]
        public IActionResult GetMovie(string id)
        {
            var movie = _movieContext.movies_titles.FirstOrDefault(m => m.show_id == id);
            if (movie == null)
            {
                return NotFound();
            }
            return Ok(movie);
        }
        
        [HttpPost("AddMovie")]
        public IActionResult AddProject([FromBody]MovieTitle newMovie)
        {
            _movieContext.movies_titles.Add(newMovie);
            _movieContext.SaveChanges();
            return Ok(newMovie);
        }
        
        
        [HttpPut("updatemovie/{show_id}")]
        public IActionResult UpdateMovie(string show_id, [FromBody] MovieTitle updatedMovie)
        {
            var existingMovie = _movieContext.movies_titles.Find(show_id);
            if (existingMovie == null)
            {
                return NotFound($"Movie with ID {show_id} not found.");
            }

            // Update basic movie info
            existingMovie.type = updatedMovie.type;
            existingMovie.title = updatedMovie.title;
            existingMovie.director = updatedMovie.director;
            existingMovie.cast = updatedMovie.cast;
            existingMovie.country = updatedMovie.country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;

            // Update genre flags
            existingMovie.Action = updatedMovie.Action;
            existingMovie.Adventure = updatedMovie.Adventure;
            existingMovie.AnimeSeriesInternationalTVShows = updatedMovie.AnimeSeriesInternationalTVShows;
            existingMovie.BritishTVShowsDocuseriesInternationalTVShows = updatedMovie.BritishTVShowsDocuseriesInternationalTVShows;
            existingMovie.Children = updatedMovie.Children;
            existingMovie.Comedies = updatedMovie.Comedies;
            existingMovie.ComediesDramasInternationalMovies = updatedMovie.ComediesDramasInternationalMovies;
            existingMovie.ComediesInternationalMovies = updatedMovie.ComediesInternationalMovies;
            existingMovie.ComediesRomanticMovies = updatedMovie.ComediesRomanticMovies;
            existingMovie.CrimeTVShowsDocuseries = updatedMovie.CrimeTVShowsDocuseries;
            existingMovie.Documentaries = updatedMovie.Documentaries;
            existingMovie.DocumentariesInternationalMovies = updatedMovie.DocumentariesInternationalMovies;
            existingMovie.Docuseries = updatedMovie.Docuseries;
            existingMovie.Dramas = updatedMovie.Dramas;
            existingMovie.DramasInternationalMovies = updatedMovie.DramasInternationalMovies;
            existingMovie.DramasRomanticMovies = updatedMovie.DramasRomanticMovies;
            existingMovie.FamilyMovies = updatedMovie.FamilyMovies;
            existingMovie.Fantasy = updatedMovie.Fantasy;
            existingMovie.HorrorMovies = updatedMovie.HorrorMovies;
            existingMovie.InternationalMoviesThrillers = updatedMovie.InternationalMoviesThrillers;
            existingMovie.InternationalTVShowsRomanticTVShowsTVDramas = updatedMovie.InternationalTVShowsRomanticTVShowsTVDramas;
            existingMovie.KidsTV = updatedMovie.KidsTV;
            existingMovie.LanguageTVShows = updatedMovie.LanguageTVShows;
            existingMovie.Musicals = updatedMovie.Musicals;
            existingMovie.NatureTV = updatedMovie.NatureTV;
            existingMovie.RealityTV = updatedMovie.RealityTV;
            existingMovie.Spirituality = updatedMovie.Spirituality;
            existingMovie.TVAction = updatedMovie.TVAction;
            existingMovie.TVComedies = updatedMovie.TVComedies;
            existingMovie.TVDramas = updatedMovie.TVDramas;
            existingMovie.TalkShowsTVComedies = updatedMovie.TalkShowsTVComedies;
            existingMovie.Thrillers = updatedMovie.Thrillers;

            _movieContext.movies_titles.Update(existingMovie);
            _movieContext.SaveChanges();

            return Ok(existingMovie);
        }
    
        [HttpDelete("DeleteMovie/{show_id}")]
        public IActionResult DeleteMovie(string show_id)
        {
            var movie = _movieContext.movies_titles.Find(show_id);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }
            _movieContext.movies_titles.Remove(movie);
            _movieContext.SaveChanges();
            
            return NoContent();
        }

        [HttpGet("GetSimilarMovies/{show_id}")]
        public IActionResult GetSimilarMovies(string show_id)
        {
            var rec = _movieContext.recommendations.FirstOrDefault(r => r.show_id == show_id);

            List<MovieTitle> recommendedMovies = new();

            if (rec != null)
            {
                var recommendedIds = new List<string?>
                {
                    rec.Recommendation_1,
                    rec.Recommendation_2,
                    rec.Recommendation_3,
                    rec.Recommendation_4,
                    rec.Recommendation_5
                }.Where(id => !string.IsNullOrEmpty(id)).ToList();

                recommendedMovies = _movieContext.movies_titles
                    .Where(m => recommendedIds.Contains(m.show_id))
                    .ToList();
            }

            // ✅ Fallback if nothing found or not in recommendations
            if (recommendedMovies.Count == 0)
            {
                var original = _movieContext.movies_titles.FirstOrDefault(m => m.show_id == show_id);
                if (original == null)
                {
                    return NotFound(new { message = "Movie not found." });
                }

                // ✅ Get all genre fields that are true (reflection-safe)
                var genresToMatch = original.GetType()
                    .GetProperties()
                    .Where(p => p.PropertyType == typeof(bool) && (bool)p.GetValue(original))
                    .Select(p => p.Name)
                    .ToList();

                // ✅ Pull all movies into memory (excluding self)
                var allMovies = _movieContext.movies_titles
                    .Where(m => m.show_id != show_id)
                    .ToList();

                // ✅ Match genres in memory
                recommendedMovies = allMovies
                    .Where(m => genresToMatch.Any(genre =>
                        m.GetType().GetProperty(genre)?.GetValue(m) is bool b && b))
                    .Take(5)
                    .ToList();
            }

            return Ok(new { movies = recommendedMovies });
        }
        [HttpGet("ratings/average/{show_id}")]
        public IActionResult GetAverageRating(string show_id)
        {
            var ratings = _movieContext.movies_ratings
                .Where(r => r.show_id == show_id)
                .ToList();

            if (ratings.Count == 0)
            {
                return Ok(new { average = (double?)null });
            }

            double average = ratings.Average(r => r.rating ?? 0);
            return Ok(new { average });
        }
        
        [HttpGet("UserRecommendations")]
        public IActionResult GetUserRecommendations()
        {
            // Step 1: Get all the genre-based recommendations into memory
            var genreRecs = _movieContext.requirement2data.ToList();

            // Step 2: Flatten all the show_ids you want to fetch from movies_titles
            var allShowIds = genreRecs
                .SelectMany(r => new[]
                {
                    r.Recommendation_1, r.Recommendation_2, r.Recommendation_3,
                    r.Recommendation_4, r.Recommendation_5, r.Recommendation_6,
                    r.Recommendation_7, r.Recommendation_8, r.Recommendation_9, r.Recommendation_10
                })
                .Distinct()
                .ToList();

            // Step 3: Fetch all matching movies in one go
            var allMovies = _movieContext.movies_titles
                .Where(m => allShowIds.Contains(m.show_id))
                .ToList();

            // Step 4: Build the result grouped by genre
            var result = genreRecs.ToDictionary(
                rec => rec.Genre,
                rec => new[]
                    {
                        rec.Recommendation_1, rec.Recommendation_2, rec.Recommendation_3,
                        rec.Recommendation_4, rec.Recommendation_5, rec.Recommendation_6,
                        rec.Recommendation_7, rec.Recommendation_8, rec.Recommendation_9, rec.Recommendation_10
                    }
                    .Select(id => allMovies.FirstOrDefault(m => m.show_id == id))
                    .Where(m => m != null) // Just in case some show_ids don't match
                    .ToList()
            );

            return Ok(result);
        }


    }
}
