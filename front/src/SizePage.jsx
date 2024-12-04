import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";

const SizesPage = () => {
    const [sizes, setSizes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await fetch("http://localhost:3005/size");
                const data = await response.json();

                const uniqueSizes = Array.from(new Set(data.flatMap((item) => item.size.split(",")).map((size) => size.trim()))).sort();

                setSizes(uniqueSizes);
            } catch (error) {
                console.error("Error fetching sizes:", error);
            }
        };

        fetchSizes();
    }, []);

    const handleSizeClick = (size) => {
        navigate(`/cats/size/${size}`);
    };

    return (
        <div>
            <h2>Sizes</h2>
            <ul>
                {sizes.map((size, index) => (
                    <li key={index} onClick={() => handleSizeClick(size)}>
                        {size}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SizesPage;
