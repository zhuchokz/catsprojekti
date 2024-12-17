import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./colorspages.css";

const ColoursPage = () => {
  const [colors, setColors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/colors');
        const data = await response.json();

        const uniqueColors = Array.from(
          new Set(
            data
              .flatMap((item) => item.color.split(','))
              .map((color) => color.trim())
          )
        ).sort();

        setColors(uniqueColors);
      } catch (error) {
        console.error('Error fetching colors:', error);
      }
    };

    fetchCats();
  }, []);

  const handleColorClick = (color) => {
    navigate(`/cats/color/${color}`);
  };


  return (
    <>
      <h2>Colors</h2>
      <div className="colours-page">
        <div className="colordiv">
          <ul>
            {colors.length > 0 ? (
              colors.map((color, index) => (
                <div
                  key={index}
                  className="color-item"
                  onClick={() => handleColorClick(color)}
                >
                  <li>{color}</li>
                </div>
              ))
            ) : (
              <p>No colors available.</p>
            )}
          </ul>
        </div>
      </div>

    </>

  );
};

export default ColoursPage;
