import { Link } from 'react-router-dom'
import './Home.css'

function Home(props) {
    return <>
        <h2>Home</h2>
        {/* Put Home HTML Here */}
        <Link className='page-link' to="/benchpress">Test</Link>
    </>
}

export default Home