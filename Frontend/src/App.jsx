import React, { useState } from 'react';
import { Sparkles, AlertCircle, ShoppingBag, AlignLeft, Tag, Leaf, AlignRight } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({ product_name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_name || !formData.description) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to generate output. Make sure the backend is running and OpenRouter API key is valid.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h1>AI Product Engine</h1>
      <p className="subtitle">Instantly generate SEO tags, categories, and sustainability filters using AI</p>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product_name">
            <ShoppingBag size={18} />
            Product Name
          </label>
          <input
            id="product_name"
            name="product_name"
            type="text"
            placeholder="e.g. Bamboo Toothbrush"
            value={formData.product_name}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            <AlignLeft size={18} />
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the product, its materials, and use-cases..."
            value={formData.description}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner"></div>
              Analyzing Product...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Magic
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="results-container">
          <div className="result-card">
            <div className="result-header">
              <AlignRight size={20} className="icon" />
              Categorization
            </div>
            <div className="category-text">
              <strong>{result.category}</strong>
              {result.subcategory && <span className="sub-category">&rarr; {result.subcategory}</span>}
            </div>
          </div>

          {result.tags && result.tags.length > 0 && (
            <div className="result-card">
              <div className="result-header">
                <Tag size={20} className="icon" />
                SEO Tags
              </div>
              <div className="badges">
                {result.tags.map((tag, idx) => (
                  <span key={idx} className="badge">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {result.filters && result.filters.length > 0 && (
            <div className="result-card">
              <div className="result-header">
                <Leaf size={20} className="icon" style={{color: 'var(--success)'}} />
                Sustainability Filters
              </div>
              <div className="badges">
                {result.filters.map((filter, idx) => (
                  <span key={idx} className="badge filter">{filter}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
