import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./pages.css";

const Character = () => {
    const [personalities, setPersonalities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPersonalities = async () => {
            try {
                const response = await fetch('http://localhost:3005/character'); 
                const data = await response.json();

                const uniquePersonalities = Array.from(
                    new Set(
                        data
                            .flatMap((item) => item.personality.split(',')) 
                            .map((personality) => personality.trim()) 
                    )
                ).sort(); 

                setPersonalities(uniquePersonalities);
            } catch (error) {
                console.error('Error fetching personalities:', error);
            }
        };

        fetchPersonalities();
    }, []);

    const handlePersonalityClick = (personality) => {
        navigate(`/cats/character/${personality}`); 
    };

    return (
        <div className='character-page'>
            <h2>Personalities</h2>
            <ul>
                {personalities.map((personality, index) => (
                    <li key={index} onClick={() => handlePersonalityClick(personality)}>
                        {personality} 
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};



export default Character;
