import AuthorizeView from "../components/AuthorizeView"
import MovieList from "../components/MovieList"

const HomePage = () => {
    return(
        <AuthorizeView>
            <MovieList/>
        </AuthorizeView>
    )
}

export default HomePage