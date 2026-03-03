import { useState, useEffect } from 'react';
import { FaRobot, FaCheckCircle, FaClock, FaBook, FaBug, FaSignOutAlt } from 'react-icons/fa';
import { scrapeURL, getPending, approveScheme, rejectScheme, getAdminStats } from '../services/api';
import './Admin.css';

// ── Steps shown while scraping ────────────────────────────────────────────────
const SCRAPE_STEPS = [
    '🌐 Launching headless browser...',
    '📄 Navigating to the page...',
    '📸 Capturing screenshot...',
    '🧹 Extracting clean text content...',
    '✨ Running Gemini AI extraction...',
    '💾 Saving to pending queue...',
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Admin() {
    const [password, setPassword] = useState(localStorage.getItem('admin_pass') || '');
    const [isAuth, setIsAuth] = useState(false);
    const [url, setUrl] = useState('');
    const [pending, setPending] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scraping, setScraping] = useState(false);
    const [scrapeStep, setScrapeStep] = useState(0);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // ── Auth ──────────────────────────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const [pendingRes, statsRes] = await Promise.all([
                getPending(password),
                getAdminStats(password),
            ]);
            setPending(pendingRes.data);
            setStats(statsRes.data);
            setIsAuth(true);
            localStorage.setItem('admin_pass', password);
        } catch {
            setError('Wrong password or server is offline.');
            setIsAuth(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_pass');
        setIsAuth(false);
        setPassword('');
        setPending([]);
        setStats(null);
    };

    // ── Fetch helpers ─────────────────────────────────────────────────────────
    const fetchAll = async () => {
        try {
            const [pendingRes, statsRes] = await Promise.all([
                getPending(password),
                getAdminStats(password),
            ]);
            setPending(pendingRes.data);
            setStats(statsRes.data);
        } catch (err) {
            setError('Failed to refresh data.');
        }
    };

    // ── Scrape ────────────────────────────────────────────────────────────────
    const handleScrape = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setScraping(true);
        setScrapeStep(0);

        // Cycle through steps visually while waiting for response
        const interval = setInterval(() => {
            setScrapeStep((s) => (s < SCRAPE_STEPS.length - 1 ? s + 1 : s));
        }, 1800);

        try {
            await scrapeURL(url, password);
            clearInterval(interval);
            setScrapeStep(SCRAPE_STEPS.length - 1);
            setMessage(`✅ Success! Scheme scraped from ${url} and is ready for review.`);
            setUrl('');
            await fetchAll();
        } catch (err) {
            clearInterval(interval);
            setError(`❌ ${err.message || 'Scraping failed. Check console for details.'}`);
        } finally {
            setScraping(false);
            setScrapeStep(0);
        }
    };

    // ── Approve ───────────────────────────────────────────────────────────────
    const handleApprove = async (id, name) => {
        setError('');
        setMessage(`🔄 Approving "${name}" and generating translations...`);
        try {
            await approveScheme(id, password);
            setMessage(`✅ "${name}" approved, published & auto-translated.`);
            await fetchAll();
        } catch (err) {
            setError(`❌ Approval failed: ${err.message}`);
            setMessage('');
        }
    };

    // ── Reject ────────────────────────────────────────────────────────────────
    const handleReject = async (id, name) => {
        if (!window.confirm(`Reject and delete "${name}"?`)) return;
        try {
            await rejectScheme(id, password);
            setMessage(`🗑️ "${name}" rejected and removed.`);
            await fetchAll();
        } catch (err) {
            setError(`❌ Rejection failed: ${err.message}`);
        }
    };

    // ── Login Screen ──────────────────────────────────────────────────────────
    if (!isAuth) {
        return (
            <div className="admin container section">
                <div className="admin__login-wrap">
                    <div className="card admin__login-card">
                        <div className="admin__login-icon"><FaRobot /></div>
                        <h2>Admin Panel</h2>
                        <p className="admin__login-sub">SchemeSathi Layer 2 Control</p>
                        <form onSubmit={handleLogin} className="admin__login-form">
                            <input
                                className="input"
                                type="password"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                                {loading ? 'Authenticating...' : 'Login →'}
                            </button>
                        </form>
                        {error && <p className="admin__login-error">{error}</p>}
                    </div>
                </div>
            </div>
        );
    }

    // ── Main Dashboard ────────────────────────────────────────────────────────
    return (
        <div className="admin container section">

            {/* Header */}
            <div className="admin__dashboard-header">
                <div>
                    <h1 className="admin__title">Admin Control Panel</h1>
                    <p className="admin__sub">Layer 2 · AI Scraping & Approval Engine</p>
                </div>
                <button className="btn btn-ghost admin__logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* Stats bar */}
            {stats && (
                <div className="admin__stats-bar">
                    <div className="admin__stat-card">
                        <FaBook className="admin__stat-icon admin__stat-icon--green" />
                        <div>
                            <div className="admin__stat-val">{stats.total_published}</div>
                            <div className="admin__stat-label">Published Schemes</div>
                        </div>
                    </div>
                    <div className="admin__stat-card">
                        <FaClock className="admin__stat-icon admin__stat-icon--orange" />
                        <div>
                            <div className="admin__stat-val">{stats.total_pending}</div>
                            <div className="admin__stat-label">Pending Review</div>
                        </div>
                    </div>
                    <div className="admin__stat-card">
                        <FaCheckCircle className="admin__stat-icon admin__stat-icon--blue" />
                        <div>
                            <div className="admin__stat-val">{pending.filter(p => p.status === 'pending').length}</div>
                            <div className="admin__stat-label">Awaiting Action</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Alerts */}
            {message && <div className="admin__message">{message}</div>}
            {error && <div className="admin__error">{error}</div>}

            {/* Scrape Input */}
            <div className="card admin__card">
                <h2>🌐 Scrape New Scheme from Official URL</h2>
                <p className="admin__note" style={{ marginBottom: '1rem' }}>
                    Paste any official Indian government scheme URL. Puppeteer will render the full page, capture a screenshot, and Gemini will extract structured data automatically.
                </p>
                <form className="admin__form" onSubmit={handleScrape}>
                    <input
                        className="input"
                        type="url"
                        placeholder="https://pmkisan.gov.in · https://myscheme.gov.in/schemes/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        disabled={scraping}
                    />
                    <button className="btn btn-primary" disabled={scraping} style={{ whiteSpace: 'nowrap' }}>
                        {scraping ? '🔄 Scraping...' : '✨ Scrape & Extract'}
                    </button>
                </form>

                {/* Step-by-step progress */}
                {scraping && (
                    <div className="admin__progress">
                        {SCRAPE_STEPS.map((step, i) => (
                            <div
                                key={i}
                                className={`admin__progress-step ${i <= scrapeStep ? 'admin__progress-step--active' : ''} ${i < scrapeStep ? 'admin__progress-step--done' : ''}`}
                            >
                                <span className="admin__progress-dot" />
                                {step}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pending Review Queue */}
            <div className="admin__pending">
                <h2>📋 Pending Review Queue ({pending.length})</h2>

                {pending.length === 0 ? (
                    <div className="card admin__empty">
                        <FaCheckCircle style={{ fontSize: '2rem', color: 'var(--green-500)' }} />
                        <p>No pending schemes — the queue is clear!</p>
                    </div>
                ) : (
                    <div className="admin__list">
                        {pending.map((item) => (
                            <div key={item.id} className="card admin__item">
                                {/* Item header */}
                                <div className="admin__item-header">
                                    <h3>{item.name || 'Unnamed Scheme'}</h3>
                                    <span className="badge badge-orange">Pending</span>
                                </div>

                                {/* Meta */}
                                <div className="admin__item-meta">
                                    <span><strong>Category:</strong> {item.category || 'N/A'}</span>
                                    <span><strong>State:</strong> {item.state || 'N/A'}</span>
                                    <span><strong>Scraped:</strong> {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}</span>
                                </div>
                                <p className="admin__item-source">
                                    🔗 <a href={item.source_url} target="_blank" rel="noreferrer">{item.source_url}</a>
                                </p>

                                {/* Screenshot preview */}
                                {item.screenshot_url && (
                                    <details className="admin__screenshot-box">
                                        <summary>🖼️ View Page Screenshot</summary>
                                        <img src={item.screenshot_url} alt="Scraped page preview" className="admin__screenshot" />
                                    </details>
                                )}

                                {/* AI Extracted Data Preview */}
                                <div className="admin__item-preview">
                                    <p><strong>📝 Summary:</strong> {item.summary || item.description?.substring(0, 200) + '...'}</p>
                                    {item.eligibility && (
                                        <p><strong>👤 Eligibility:</strong> {item.eligibility.gender}, Age {item.eligibility.min_age}–{item.eligibility.max_age || '∞'}, Income ≤ ₹{item.eligibility.income_limit || 'Any'}</p>
                                    )}
                                    {item.required_documents?.length > 0 && (
                                        <p><strong>📄 Docs:</strong> {item.required_documents.join(' · ')}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="admin__item-actions">
                                    <button className="btn btn-primary" onClick={() => handleApprove(item.id, item.name)}>
                                        <FaCheckCircle /> Approve & Publish
                                    </button>
                                    <button className="btn btn-ghost admin__reject-btn" onClick={() => handleReject(item.id, item.name)}>
                                        <FaBug /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
