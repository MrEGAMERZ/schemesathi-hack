import { Link } from 'react-router-dom';
import { FaCheckCircle, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import './SchemeCard.css';

const CATEGORY_COLORS = {
    Agriculture: 'badge-green',
    Women: 'badge-orange',
    Education: 'badge-blue',
    Health: 'badge-blue',
    Housing: 'badge-green',
    Labor: 'badge-orange',
};

export default function SchemeCard({ scheme }) {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
        setIsSaved(saved.some(s => s.id === scheme.id));
    }, [scheme.id]);

    const toggleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const saved = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
        let newSaved;
        if (isSaved) {
            newSaved = saved.filter(s => s.id !== scheme.id);
        } else {
            newSaved = [...saved, scheme];
        }
        localStorage.setItem('saved_schemes', JSON.stringify(newSaved));
        setIsSaved(!isSaved);
        // Dispatch custom event to notify Saved page if open
        window.dispatchEvent(new Event('saved_schemes_updated'));
    };

    const badgeClass = CATEGORY_COLORS[scheme.category] || 'badge-blue';

    return (
        <article className="scheme-card card fade-in">
            <div className="scheme-card__body">
                <div className="scheme-card__header">
                    <span className={`badge ${badgeClass} scheme-card__badge`}>
                        {scheme.category}
                    </span>
                    {scheme.verified && (
                        <span className="badge badge-verified" title="Admin Verified">
                            <FaCheckCircle size={10} /> Verified
                        </span>
                    )}
                    <button
                        className={`scheme-card__save ${isSaved ? 'scheme-card__save--active' : ''}`}
                        onClick={toggleSave}
                        title={isSaved ? 'Remove from saved' : 'Save for later'}
                    >
                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                </div>
                <h3 className="scheme-card__name">{scheme.name}</h3>
                <p className="scheme-card__summary">
                    {scheme.summary || scheme.description?.substring(0, 120) + '...'}
                </p>
            </div>
            <div className="scheme-card__footer">
                <Link to={`/scheme/${scheme.id}`} className="btn btn-primary scheme-card__btn">
                    View Details →
                </Link>
            </div>
        </article>
    );
}
