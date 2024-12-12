import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Comments from './comments';  
import "./pages.css";

const BreedPage = () => {
    const { breed } = useParams(); 
    const [cat, setCat] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const [userId, setUserId] = useState(user.user_id); 

    useEffect(() => {
        const fetchCat = async () => {
            try {
                const response = await fetch(`http://localhost:3005/cats/${breed}`);
                const data = await response.json();
                if (data.length > 0) {
                    setCat(data[0]); 
                } else {
                    setCat(null);
                }
            } catch (error) {
                console.error('Error fetching cat:', error);
            }
        };
        fetchCat();
    }, [breed]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:3005/favorites/${userId}`);
                const data = await response.json();
                setFavorites(data);
                setIsFavorite(data.some(favorite => favorite.cat_id === cat?.id));
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };
        if (cat) {
            fetchFavorites();
        }
    }, [cat, userId]);

    const handleToggleFavorite = async () => {
        if (!cat) return;

        if (isFavorite) {
            try {
                await fetch(`http://localhost:3005/favorites/${cat.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userId }),
                });
                setFavorites(favorites.filter(favorite => favorite.cat_id !== cat.id));
                setIsFavorite(false);
            } catch (error) {
                console.error('Error removing favorite:', error);
            }
        } else {
            try {
                await fetch('http://localhost:3005/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userId, cat_id: cat.id }),
                });
                setFavorites([...favorites, { user_id: userId, cat_id: cat.id }]);
                setIsFavorite(true);
            } catch (error) {
                console.error('Error adding favorite:', error);
            }
            
        }
    };

    if (!cat) {
        return <p>No cat found for this breed.</p>;
    }

    return (
        <>
            <h2 className='h2breed'>{cat.breed} Cat</h2>
            <div className="breed-page-container">
                <img className="breed-image" src={`/images/cats/${cat.photo}`} alt={cat.breed} />
                <div className="cat-details">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin eget ligula vel facilisis. Duis placerat massa mattis nulla laoreet hendrerit. Curabitur sed sodales purus, nec bibendum dolor. Donec porta velit sapien, vitae ullamcorper mi eleifend eget. Curabitur consectetur turpis orci, vitae tempor enim euismod nec. Phasellus ac massa vel enim efficitur blandit eu varius risus. Integer leo felis, venenatis nec lacinia eget, cursus at odio. Pellentesque euismod, ligula a maximus mattis, dolor est lobortis leo, non dapibus ante odio id odio. Nam diam lacus, congue id orci sed, fringilla sollicitudin ante. Quisque sed finibus ipsum, at elementum urna.</p>
                    <strong>Color:</strong> {cat.color} <br />
                    <strong>Personality:</strong> {cat.personality} <br />
                    <strong>Size:</strong> {cat.size} <br />
                    <strong>Facts:</strong> {cat.breed_facts} <br />
                    <button className='favorites' onClick={handleToggleFavorite}>
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                </div>
            </div>
            <Comments breed={breed} />
        </>
    );
};

export default BreedPage;