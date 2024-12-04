import { Link } from 'react-router-dom';
import './HomePage.css';
const HomePage = () => {
    return (
        <div className="home-page">
            <section className="about-section">
                <h2>About the site</h2>
                <p ><strong>
                This site serves as an informational resource, similar to a Wikipedia page, dedicated to providing detailed data about various cat breeds, their colors, sizes, personalities, and more.<br></br> The goal is to offer users a comprehensive overview of cats for educational and research purposes. 
                <br/> Just like Wikipedia</strong></p>
            </section>
            
            <section className="categories-section">
                <div className="category">
                    <h3>All Cats</h3>
                    <img className='photo' src="/public/images/catphoto.jpg" alt="aaa" />
                    <Link to="/cats" className='links'>Read more</Link>
                    </div>
                <div className="category">
                    <h3>Colours</h3>
                    <img className='photo' src="/public/images/cat2.png" alt="aaa" />
                    <Link to="/colours" className="links">Read more</Link>
                </div>
                <div className="category">
                    <h3>Size</h3>
                    <img className='photo' src="/public/images/cat1.png" alt="aaa" />
                    <Link to="/size" className="links">Read more</Link>
                </div>
                <div className="category">
                    <h3>Character</h3>
                    <img className='photo' src="/public/images/character.png" alt="aaa" />
                    <Link to="/character" className="links">Read more</Link>
                </div>
            </section>
            
        </div>
    );
};

export default HomePage;