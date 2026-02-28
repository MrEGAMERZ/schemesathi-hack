import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getSchemes } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import CategoryFilter from '../components/CategoryFilter';
import './Home.css';

export default function Home() {
    const [schemes, setSchemes] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const res = await getSchemes();
                setSchemes(res.data);
                setFiltered(res.data);
            } catch (err) {
                setError('Failed to load schemes. Please make sure the backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, []);

    useEffect(() => {
        let result = schemes;
        if (category !== 'All') {
            result = result.filter((s) => s.category === category);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    (s.summary || s.description || '').toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [search, category, schemes]);

    return (
        <div className="home">
            {/* Hero */}
            <section className="home__hero">
                <div className="container">
                    <div className="home__hero-content">
                        <div className="home__hero-badge badge badge-green">🇮🇳 AI-Powered Scheme Guide</div>
                        <h1 className="home__hero-title">
                            Find Government Schemes <br />
                            <span className="home__hero-accent">Made for You</span>
                        </h1>
                        <p className="home__hero-sub">
                            Search from 12+ real government schemes. Check eligibility, understand benefits,
                            and get AI-simplified explanations in your language.
                        </p>
                        <div className="home__search-wrap">
                            <FaSearch className="home__search-icon" />
                            <input
                                className="input home__search"
                                type="text"
                                placeholder="Search by scheme name or keyword..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters + Grid */}
            <div className="container section">
                <div className="home__filter-row">
                    <h2 className="home__section-title">All Schemes</h2>
                    <CategoryFilter selected={category} onSelect={setCategory} />
                </div>

                {loading && (
                    <div className="spinner-wrap">
                        <div className="spinner" />
                    </div>
                )}

                {error && (
                    <div className="home__error">
                        ⚠️ {error}
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="home__empty">
                        No schemes found for your search. Try different keywords or select a category.
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <>
                        <p className="home__count">{filtered.length} scheme{filtered.length !== 1 ? 's' : ''} found</p>
                        <div className="home__grid">
                            {filtered.map((scheme) => (
                                <SchemeCard key={scheme.id} scheme={scheme} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
