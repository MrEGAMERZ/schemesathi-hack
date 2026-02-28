import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLightbulb } from 'react-icons/fa';
import { recommend } from '../services/api';
import './Recommend.css';

const STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
];

const CATEGORY_COLORS = {
    Agriculture: '#166534',
    Women: '#c2410c',
    Education: '#1d4ed8',
    Health: '#0369a1',
    Housing: '#15803d',
    Labor: '#b45309',
};

export default function Recommend() {
    const [form, setForm] = useState({
        age: '', gender: 'male', income: '', state: '', occupation: '',
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResults([]);
        setLoading(true);
        try {
            const res = await recommend({
                age: Number(form.age),
                gender: form.gender,
                income: Number(form.income),
                state: form.state,
                occupation: form.occupation,
            });
            setResults(res.data);
            setSearched(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recommend">
            {/* Hero */}
            <div className="recommend__hero">
                <div className="container">
                    <div className="recommend__hero-badge badge"><FaLightbulb /> AI Scheme Matcher</div>
                    <h1 className="recommend__title">Find Schemes Matched to Your Profile</h1>
                    <p className="recommend__sub">
                        Enter your details and our AI engine will identify the top 3 government schemes you are eligible for.
                    </p>
                </div>
            </div>

            <div className="container section">
                <div className="recommend__layout">
                    {/* Form */}
                    <div className="card recommend__form-card">
                        <div className="recommend__form-header">
                            <h2>Your Profile</h2>
                            <p>All fields are required</p>
                        </div>
                        <form className="recommend__form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="label">Age</label>
                                <input className="input" type="number" min="0" max="120" placeholder="e.g. 28"
                                    value={form.age} onChange={(e) => set('age', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="label">Gender</label>
                                <select className="input select" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="label">Annual Income (₹)</label>
                                <input className="input" type="number" min="0" placeholder="e.g. 150000"
                                    value={form.income} onChange={(e) => set('income', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="label">State</label>
                                <select className="input select" value={form.state} onChange={(e) => set('state', e.target.value)} required>
                                    <option value="">Select your state</option>
                                    {STATES.map((s) => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="label">Occupation</label>
                                <input className="input" type="text" placeholder="e.g. farmer, student, laborer, none"
                                    value={form.occupation} onChange={(e) => set('occupation', e.target.value)} required />
                            </div>

                            {error && <p className="error-text">{error}</p>}

                            <button type="submit" className="btn btn-primary recommend__submit" disabled={loading}>
                                {loading ? (
                                    <><span className="btn-spinner" /> Finding Schemes...</>
                                ) : (
                                    '🔍 Find My Schemes'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Results */}
                    <div className="recommend__results">
                        {loading && (
                            <div className="spinner-wrap" style={{ height: 300 }}>
                                <div className="spinner" />
                            </div>
                        )}

                        {!loading && searched && results.length === 0 && (
                            <div className="recommend__empty">
                                <p>No strong matches found. Try adjusting your profile details.</p>
                            </div>
                        )}

                        {!loading && results.length > 0 && (
                            <>
                                <h2 className="recommend__results-title">
                                    🎯 Top {results.length} Recommended Schemes
                                </h2>
                                <div className="recommend__cards">
                                    {results.map((scheme, i) => (
                                        <div key={scheme.id} className="rec-card card fade-in">
                                            <div className="rec-card__rank">#{i + 1}</div>
                                            <div className="rec-card__body">
                                                <div className="rec-card__cat" style={{ color: CATEGORY_COLORS[scheme.category] || '#15803d' }}>
                                                    {scheme.category}
                                                </div>
                                                <h3 className="rec-card__name">{scheme.name}</h3>
                                                <p className="rec-card__summary">
                                                    {scheme.summary || scheme.description?.substring(0, 110) + '...'}
                                                </p>
                                                <div className="rec-card__reason">
                                                    <span>✓</span> {scheme.reason}
                                                </div>
                                            </div>
                                            <div className="rec-card__footer">
                                                <Link to={`/scheme/${scheme.id}`} className="btn btn-primary rec-card__btn">
                                                    View Details →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {!loading && !searched && (
                            <div className="recommend__placeholder">
                                <div className="recommend__placeholder-icon">🎯</div>
                                <h3>Your matched schemes will appear here</h3>
                                <p>Fill in your profile on the left to get personalized scheme recommendations.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
