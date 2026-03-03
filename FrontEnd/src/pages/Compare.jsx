import { useState, useEffect } from 'react';
import { getSchemes } from '../services/api';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './Compare.css';

export default function Compare() {
    const [schemes, setSchemes] = useState([]);
    const [id1, setId1] = useState('');
    const [id2, setId2] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const res = await getSchemes();
            setSchemes(res.data);
        };
        fetch();
    }, []);

    const s1 = schemes.find(s => s.id === id1);
    const s2 = schemes.find(s => s.id === id2);

    const ComparisonRow = ({ label, val1, val2, type = 'text' }) => (
        <div className="compare-row">
            <div className="compare-row__label">{label}</div>
            <div className="compare-row__values">
                <div className="compare-row__val">
                    {type === 'bool' ? (val1 ? <FaCheckCircle className="icon-green" /> : <FaTimesCircle className="icon-red" />) : val1 || '-'}
                </div>
                <div className="compare-row__val">
                    {type === 'bool' ? (val2 ? <FaCheckCircle className="icon-green" /> : <FaTimesCircle className="icon-red" />) : val2 || '-'}
                </div>
            </div>
        </div>
    );

    return (
        <div className="compare container section">
            <div className="compare__header">
                <h1>Compare Schemes</h1>
                <p>Select two government schemes to see how they differ.</p>
            </div>

            <div className="compare__selectors">
                <div className="compare__select-box">
                    <label>First Scheme</label>
                    <select className="input select" value={id1} onChange={(e) => setId1(e.target.value)}>
                        <option value="">Select a scheme...</option>
                        {schemes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="compare__vs" style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--gray-300)' }}>VS</div>
                <div className="compare__select-box">
                    <label>Second Scheme</label>
                    <select className="input select" value={id2} onChange={(e) => setId2(e.target.value)}>
                        <option value="">Select a scheme...</option>
                        {schemes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            {s1 && s2 ? (
                <div className="compare__table fade-in">
                    <ComparisonRow label="Category" val1={s1.category} val2={s2.category} />
                    <ComparisonRow label="State" val1={s1.state} val2={s2.state} />
                    <ComparisonRow label="Min Age" val1={s1.eligibility?.min_age} val2={s2.eligibility?.min_age} />
                    <ComparisonRow label="Max Age" val1={s1.eligibility?.max_age} val2={s2.eligibility?.max_age} />
                    <ComparisonRow label="Gender" val1={s1.eligibility?.gender} val2={s2.eligibility?.gender} />
                    <ComparisonRow label="Income Limit" val1={s1.eligibility?.income_limit ? `₹${s1.eligibility.income_limit}` : 'None'} val2={s2.eligibility?.income_limit ? `₹${s2.eligibility.income_limit}` : 'None'} />
                    <ComparisonRow label="Occupation" val1={s1.eligibility?.occupation} val2={s2.eligibility?.occupation} />
                    <ComparisonRow label="Admin Verified" val1={s1.verified} val2={s2.verified} type="bool" />

                    <div className="compare__details">
                        <div className="compare__detail-side">
                            <h4>Description</h4>
                            <p>{s1.summary || s1.description.substring(0, 150) + '...'}</p>
                        </div>
                        <div className="compare__detail-side">
                            <h4>Description</h4>
                            <p>{s2.summary || s2.description.substring(0, 150) + '...'}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="compare__placeholder card">
                    Select two schemes above to compare their benefits, eligibility, and features.
                </div>
            )}
        </div>
    );
}
