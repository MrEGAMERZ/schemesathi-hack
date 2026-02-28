import { Link } from 'react-router-dom';
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
    const badgeClass = CATEGORY_COLORS[scheme.category] || 'badge-blue';

    return (
        <article className="scheme-card card fade-in">
            <div className="scheme-card__body">
                <span className={`badge ${badgeClass} scheme-card__badge`}>
                    {scheme.category}
                </span>
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
