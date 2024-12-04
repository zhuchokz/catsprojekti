import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from './pages/Home';
// import Size from './pages/Size';
// import Color from './pages/Colours'
import Cats from "./pages/cats";
import Character from "./pages/Character";
import CatBreed from "./pages/Breed";
import Header from "./Header";
import HomePage from "./Homepage";
import SizesPage from "./SizePage";
import ColoursPage from "./ColorsPage";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="cats" element={<Cats />} />
                <Route path="colours" element={<ColoursPage />} />
                <Route path="size" element={<SizesPage />} />
                <Route path="character" element={<Character />} />
                <Route path="cats/:breed" element={<CatBreed />} />
                <Route path="cats/color/:color" element={<Cats />} />
                <Route path="/cats/size/:size" element={<Cats />} />
                <Route path="/cats/character/:character" element={<Cats />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
