import { useState, useEffect } from 'react';
import SchemeCard from '../components/SchemeCard';
import './Saved.css';

export default function Saved() {
    const [saved, setSaved] = useState([]);

    const loadSaved = () => {
        const schemes = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
        setSaved(schemes);
    };

    useEffect(() => {
        loadSaved();

        // Listen for updates from SchemeCard components
        window.addEventListener('saved_schemes_updated', loadSaved);
        return () => window.removeEventListener('saved_schemes_updated', loadSaved);
    }, []);

    const clearAll = () => {
        if (window.confirm('Clear all saved schemes?')) {
            localStorage.setItem('saved_schemes', '[]');
            setSaved([]);
        }
    };

    return (
        <div className="saved container section">
            <div className="saved__header">
                <div>
                    <h1>Saved Schemes</h1>
                    <p>Schemes you've bookmarked for later review.</p>
                </div>
                {saved.length > 0 && (
                    <button className="btn btn-ghost" onClick={clearAll} style={{ color: 'var(--red-600)' }}>
                        Clear All
                    </button>
                )}
            </div>

            {saved.length === 0 ? (
                <div className="saved__empty card">
                    <div className="saved__empty-icon">🔖</div>
                    <h3>No saved schemes yet</h3>
                    <p>Click the bookmark icon on any scheme to save it here for quick access.</p>
                </div>
            ) : (
                <div className="home__grid">
                    {saved.map((scheme) => (
                        <SchemeCard key={scheme.id} scheme={scheme} />
                    ))}
                </div>
            )}
        </div>
    );
}
