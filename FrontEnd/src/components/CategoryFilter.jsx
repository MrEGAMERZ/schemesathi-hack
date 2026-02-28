import './CategoryFilter.css';

const CATEGORIES = ['All', 'Agriculture', 'Women', 'Education', 'Health', 'Housing', 'Labor'];

export default function CategoryFilter({ selected, onSelect }) {
    return (
        <div className="cat-filter" role="group" aria-label="Category filters">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    className={`cat-filter__chip ${selected === cat ? 'active' : ''}`}
                    onClick={() => onSelect(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
