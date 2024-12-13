import React, { useState, useEffect } from 'react';
import "./profile.css";
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const [user, setUser] = useState(null);
  const [favoriteCats, setFavoriteCats] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {

    if (storedUser) {
      setUser(storedUser);
    } else {
      fetch('http://localhost:3005/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.username) {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          } else {
            window.location.href = '/login';
          }
        })
        .catch((error) => console.error('Error fetching user profile:', error));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = () => {
    const userId = storedUser.user_id;

    fetch(`http://localhost:3005/favorites/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('user')}`,
      },
    })
      .then((response) => response.json())
      .then((favorites) => {
        console.log(favorites);
        setFavoriteCats(favorites);
        //   const uniqueCatIds = [...new Set(favorites.map((favorite) => favorite.id))];
        //   console.log(uniqueCatIds);

        //   const fetchCatDetails = uniqueCatIds.map((catId) =>
        //     fetch(`http://localhost:3005/cats/${catId}`)
        //       .then((response) => response.json())
        //       .catch((error) => console.error(`Error fetching cat details for ${catId}:`, error))
        //   );

        //   Promise.all(fetchCatDetails).then((cats) => {
        //     console.log(cats);
        //     const validCats = cats.filter((cat) => cat && cat.id);
        //     console.log(validCats);
        //     setFavoriteCats(validCats);
        //   });
      })
      .catch((error) => console.error('Error fetching favorite cats:', error));
  };




  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleRemoveFavorite = (catId) => {
    fetch(`http://localhost:3005/favorites/${user.user_id}/${catId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('user')}`,
      },
    })
      .then(() => {
        setFavoriteCats(favoriteCats.filter((cat) => cat.id !== catId));
      })
      .catch((error) => console.error('Error removing favorite:', error));
  };

  if (!user) {
    return (
      <div className="profile-page">
        <h1>Please log in to view your profile</h1>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Welcome, {user.username}</h1>
      <div className="profile-container">
        <h2>Profile</h2>
        <p><strong>Username:</strong> {user.username}</p>
        {console.log(favoriteCats)}
        <h2>Favorites</h2>
        {favoriteCats.length > 0 ? (
          <ul>
            {favoriteCats.map((cat, index) => (
              <li key={index}>
                <a href={`/cats/${cat.breed}`}>{cat.breed}</a>
                <button onClick={() => handleRemoveFavorite(cat.id)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite cats yet.</p>
        )}
      </div>
      <button className='logout-button' onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Profile;
