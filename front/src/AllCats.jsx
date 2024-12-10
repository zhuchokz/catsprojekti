import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./pages.css";

const AllCats = () => {
    const { color, size, character } = useParams(); // Получаем параметры из URL
    const [cats, setCats] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCats = async () => {
            let url = "http://localhost:3005/cats";

            /* if (color) {
                url += `?color=${color}`;
            } else if (size) {
                url += `?size=${size}`;
            } else if (character) {
                url += `?character=${character}`;
            } */

            try {
                const response = await fetch(url);
                const data = await response.json();
                setCats(data);
            } catch (error) {
                console.error("Error fetching cats:", error);
            }
        };

        if (!cats) fetchCats();
    }, [cats]);

    useEffect(() => {
        if (color) {
            const filteredCats = cats.filter((cat) => cat.color === color);
            setFilteredList(filteredCats);
        } else if (size) {
            const filteredCats = cats.filter((cat) => cat.size === size);
            setFilteredList(filteredCats);
        } else if (character) {
            const filteredCats = cats.filter((cat) => cat.personality === character);
            setFilteredList(filteredCats);
        } else {
            setFilteredList(cats);
        }
    }, [color, size, character, cats]);

    const handleReadMore = (breed) => {
        navigate(`/cats/${breed}`);
    };

    const getTitle = () => {
        if (color) {
            return `Cats of color: ${color}`;
        } else if (size) {
            return `Cats of size: ${size}`;
        } else if (character) {
            return `Cats with character: ${character}`;
        } else {
            return "All Cats";
        }
    };

    return (
        <div>
            <h2>{getTitle()}</h2>
            <div className="allcatsdiv">
                {cats.length > 0 ? (
                    filteredList.map((cat, index) => (
                        <div key={cat.id || index} className="cat-item">
                            <p className="breed-button">{cat.breed}</p> <br />
                            <img className="cat-image" src={`/images/cats/${cat.photo}`} alt={cat.breed} />
                            <button className="read-more" onClick={() => handleReadMore(cat.breed)}>
                                Read more
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No cats found for the selected filter.</p>
                )}
            </div>
        </div>
    );
};

export default AllCats;
