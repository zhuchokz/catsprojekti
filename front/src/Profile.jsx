import { useState, useEffect } from "react";
import "./profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [favoriteCats, setFavoriteCats] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
            setUser(storedUser);
        } else {
            fetch("http://localhost:3005/profile", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("user")}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.username) {
                        setUser(data);
                        localStorage.setItem("user", JSON.stringify(data));
                    } else {
                        window.location.href = "/login";
                    }
                })
                .catch((error) => console.error("Error fetching user profile:", error));
        }

        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        const fetchFavoriteCats = async () => {
            if (favorites.length > 0) {
                const catsData = await Promise.all(
                    favorites.map(async (breed) => {
                        try {
                            const response = await fetch(`http://localhost:3005/cats/${breed}`);
                            const data = await response.json();
                            return data.length > 0 ? data[0] : null;
                        } catch (error) {
                            console.error("Error fetching cat details:", error);
                            return null;
                        }
                    })
                );

                setFavoriteCats(catsData.filter((cat) => cat !== null));
            }
        };

        fetchFavoriteCats();
    }, [favorites]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    const handleRemoveFavorite = (breed) => {
        const updatedFavorites = favorites.filter((favorite) => favorite !== breed);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setFavoriteCats(favoriteCats.filter((cat) => cat.breed !== breed));
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
                <p>
                    <strong>Username:</strong> {user.username}
                </p>
                <h2>Favorites</h2>
                {favoriteCats.length > 0 ? (
                    <ul>
                        {favoriteCats.map((cat, index) => (
                            <li key={index}>
                                <a href={`/cats/${cat.breed}`}>{cat.breed}</a>
                                <button onClick={() => handleRemoveFavorite(cat.breed)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No favorite cats yet.</p>
                )}
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Log out
            </button>
        </div>
    );
};

export default Profile;
