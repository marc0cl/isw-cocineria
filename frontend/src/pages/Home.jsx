import { useNavigate } from 'react-router-dom';
import '@styles/home.css';
import Menu from '../components/Menu.jsx';

const Home = () => {
    useNavigate();

    return (
        <main>
            <div className="main-content home-background">
                <Menu/>
            </div>
        </main>
    );
};

export default Home;
