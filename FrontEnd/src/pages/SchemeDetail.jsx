import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import {
    getSchemeById,
    simplify,
    checkEligibility,
    generateFAQ,
    translate,
} from '../services/api';
import './SchemeDetail.css';

const TABS = ['Overview', 'Eligibility', 'Documents', 'FAQs', 'Read More'];
const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Tamil'];
const STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
];

function Spinner() {
    return <div className="spinner-wrap"><div className="spinner" /></div>;
}

/* ── Overview Tab ─────────────────────────────────────────────── */
function OverviewTab({ scheme }) {
    const [simplified, setSimplified] = useState('');
    const [translated, setTranslated] = useState('');
    const [language, setLanguage] = useState('English');
    const [loadingSimplify, setLoadingSimplify] = useState(false);
    const [loadingTranslate, setLoadingTranslate] = useState(false);

    useEffect(() => {
        if (!scheme) return;
        setLoadingSimplify(true);
        simplify(scheme.description)
            .then((res) => { setSimplified(res.data); setTranslated(res.data); })
            .catch(() => setSimplified('Could not simplify. Please check backend connection.'))
            .finally(() => setLoadingSimplify(false));
    }, [scheme]);

    const handleLanguage = async (lang) => {
        setLanguage(lang);
        if (lang === 'English') { setTranslated(simplified); return; }
        if (!simplified) return;
        setLoadingTranslate(true);
        try {
            const res = await translate(simplified, lang);
            setTranslated(res.data);
        } catch {
            setTranslated(simplified);
        } finally {
            setLoadingTranslate(false);
        }
    };

    return (
        <div className="tab-content fade-in">
            <div className="overview__controls">
                <h3 className="tab-heading">AI Simplified Explanation</h3>
                <div className="lang-selector">
                    <label className="label">Language:</label>
                    <select
                        className="input select"
                        value={language}
                        onChange={(e) => handleLanguage(e.target.value)}
                        disabled={loadingSimplify || loadingTranslate}
                    >
                        {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                    </select>
                </div>
            </div>

            {loadingSimplify ? (
                <Spinner />
            ) : loadingTranslate ? (
                <Spinner />
            ) : (
                <div className="overview__text">
                    {(translated || simplified).split('\n').filter(Boolean).map((line, i) => (
                        <p key={i} className={line.startsWith('*') || line.startsWith('•') || line.startsWith('-')
                            ? 'overview__bullet' : 'overview__para'}>
                            {line.replace(/^[*•\-]\s*/, '')}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Eligibility Tab ──────────────────────────────────────────── */
function EligibilityTab({ schemeId }) {
    const [form, setForm] = useState({
        age: '', gender: 'male', income: '', state: '', occupation: '',
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);
        try {
            const res = await checkEligibility({
                schemeId,
                age: Number(form.age),
                gender: form.gender,
                income: Number(form.income),
                state: form.state,
                occupation: form.occupation,
            });
            setResult(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content fade-in">
            <h3 className="tab-heading">Check Your Eligibility</h3>
            <form className="elig-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="label">Age</label>
                        <input className="input" type="number" min="0" max="120" placeholder="e.g. 32"
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
                        <input className="input" type="number" min="0" placeholder="e.g. 120000"
                            value={form.income} onChange={(e) => set('income', e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="label">State</label>
                        <select className="input select" value={form.state} onChange={(e) => set('state', e.target.value)} required>
                            <option value="">Select state</option>
                            {STATES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                        <label className="label">Occupation</label>
                        <input className="input" type="text" placeholder="e.g. farmer, student, laborer"
                            value={form.occupation} onChange={(e) => set('occupation', e.target.value)} required />
                    </div>
                </div>
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Checking...' : 'Check Eligibility'}
                </button>
            </form>

            {result && (
                <div className={`elig-result ${result.eligible ? 'elig-result--eligible' : 'elig-result--not'} fade-in`}>
                    <div className="elig-result__badge">
                        {result.eligible
                            ? <><FaCheckCircle /> Eligible ✓</>
                            : <><FaTimesCircle /> Not Eligible</>}
                    </div>
                    <p className="elig-result__reason">{result.reason}</p>
                </div>
            )}
        </div>
    );
}

/* ── Documents Tab ────────────────────────────────────────────── */
function DocumentsTab({ documents }) {
    const DEFAULT_DOCS = ['Aadhaar Card', 'Income Certificate', 'Residence Proof', 'Bank Passbook'];
    const docs = (documents && documents.length > 0) ? documents : DEFAULT_DOCS;

    return (
        <div className="tab-content fade-in">
            <h3 className="tab-heading">Required Documents</h3>
            <ul className="doc-list">
                {docs.map((doc, i) => (
                    <li key={i} className="doc-list__item">
                        <FaCheckCircle className="doc-list__icon" />
                        {doc}
                    </li>
                ))}
            </ul>
            <div className="doc-note">
                ℹ️ Carry original documents along with self-attested photocopies when applying.
            </div>
        </div>
    );
}

/* ── FAQs Tab ─────────────────────────────────────────────────── */
function FAQsTab({ description }) {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(null);
    const [fetched, setFetched] = useState(false);

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const res = await generateFAQ(description);
            setFaqs(Array.isArray(res.data) ? res.data : []);
            setFetched(true);
        } catch {
            setFaqs([{ q: 'Could not generate FAQs', a: 'Please check backend connection.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content fade-in">
            <div className="faq-header">
                <h3 className="tab-heading">AI-Generated FAQs</h3>
                <button className="btn btn-outline" onClick={fetchFAQs} disabled={loading}>
                    {loading ? 'Generating...' : fetched ? '↻ Regenerate' : '✨ Generate FAQs'}
                </button>
            </div>

            {loading && <Spinner />}

            {!loading && faqs.length === 0 && !fetched && (
                <p className="faq-hint">Click "Generate FAQs" to create AI-powered Q&As for this scheme.</p>
            )}

            {!loading && faqs.length > 0 && (
                <div className="faq-list">
                    {faqs.map((faq, i) => (
                        <div key={i} className={`faq-item ${open === i ? 'faq-item--open' : ''}`}>
                            <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                                <span>{faq.q}</span>
                                <span className="faq-chevron">{open === i ? '▲' : '▼'}</span>
                            </button>
                            {open === i && <div className="faq-answer">{faq.a}</div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Read More Tab ────────────────────────────────────────────── */
function ReadMoreTab({ scheme }) {
    return (
        <div className="tab-content fade-in">
            <h3 className="tab-heading">Full Details</h3>

            <div className="readmore-section">
                <h4 className="readmore-section__title">Official Description</h4>
                <p className="readmore-section__text">{scheme.description}</p>
            </div>

            {scheme.application_process && (
                <div className="readmore-section">
                    <h4 className="readmore-section__title">How to Apply</h4>
                    <div className="readmore-section__steps">
                        {scheme.application_process.split('\n').filter(Boolean).map((step, i) => (
                            <p key={i}>{step}</p>
                        ))}
                    </div>
                </div>
            )}

            {scheme.deadlines && (
                <div className="readmore-section">
                    <h4 className="readmore-section__title">📅 Deadlines</h4>
                    <p className="readmore-section__text">{scheme.deadlines}</p>
                </div>
            )}

            {scheme.official_link && (
                <a
                    href={scheme.official_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary readmore-link"
                >
                    <FaExternalLinkAlt /> Visit Official Portal
                </a>
            )}
        </div>
    );
}

/* ── Main SchemeDetail Page ───────────────────────────────────── */
export default function SchemeDetail() {
    const { id } = useParams();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getSchemeById(id);
                setScheme(res.data);
            } catch {
                setError('Scheme not found.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return <Spinner />;
    if (error) return (
        <div className="container section">
            <p className="error-text" style={{ fontSize: '1rem' }}>{error}</p>
            <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>← Back</Link>
        </div>
    );

    return (
        <div className="detail">
            {/* Header */}
            <div className="detail__hero">
                <div className="container">
                    <Link to="/" className="detail__back">
                        <FaArrowLeft /> Back to Schemes
                    </Link>
                    <div className="detail__meta">
                        <span className={`badge badge-green`}>{scheme.category}</span>
                        {scheme.state && scheme.state !== 'all' && (
                            <span className="badge badge-blue">{scheme.state}</span>
                        )}
                    </div>
                    <h1 className="detail__title">{scheme.name}</h1>
                    {scheme.summary && <p className="detail__summary">{scheme.summary}</p>}
                </div>
            </div>

            {/* Tabs */}
            <div className="container">
                <div className="detail__tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            className={`detail__tab ${activeTab === tab ? 'detail__tab--active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="detail__panel">
                    {activeTab === 'Overview' && <OverviewTab scheme={scheme} />}
                    {activeTab === 'Eligibility' && <EligibilityTab schemeId={id} />}
                    {activeTab === 'Documents' && <DocumentsTab documents={scheme.required_documents} />}
                    {activeTab === 'FAQs' && <FAQsTab description={scheme.description} />}
                    {activeTab === 'Read More' && <ReadMoreTab scheme={scheme} />}
                </div>
            </div>
        </div>
    );
}
