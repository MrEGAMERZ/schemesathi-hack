import { Link, NavLink } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="container navbar__inner">
                <Link to="/" className="navbar__logo">
                    <FaLeaf className="navbar__logo-icon" />
                    <span>Scheme<strong>Sathi</strong></span>
                </Link>
                <nav className="navbar__links">
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                        Home
                    </NavLink>
                    <NavLink to="/recommend" className={({ isActive }) => isActive ? 'active' : ''}>
                        Find Schemes
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
