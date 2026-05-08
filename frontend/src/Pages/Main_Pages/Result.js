import React from 'react'
import { myList } from "../../crop-list";
import '../../Styles/Result.css';
import { getMarketPriceForCrop } from '../../utils/marketData';

const Result = ({ results }) => {
  return (
    <div className='result-predict-crop'>
      <div className='result-predict-crop-layer'>
        {results && results.length > 0 ? (
          <div className="results-container fade-in">
            <h2 className="recommendations-title">AI Powered Recommendations</h2>
            <div className="results-grid">
              {results.map((res, index) => {
                const cropInfo = myList.find(c => c.name === res.name);
                const marketData = getMarketPriceForCrop(res.name);
                
                return (
                  <div key={index} className={`result-card rank-${index + 1}`}>
                    <div className="card-rank">#{index + 1}</div>
                    
                    <div className="result-main-flex">
                        <img src={cropInfo?.src} alt={res.name} className='result-img-small'/>
                        <div className="result-text-block">
                           <h3>{res.name}</h3>
                           <div className="confidence-chip">{res.confidence}% Match</div>
                        </div>
                    </div>

                    <div className="market-price-badge">
                        <span className="price-label">EST. MARKET RATE</span>
                        <span className="price-value">
                            {marketData ? `₹${marketData.price.toLocaleString()} / ${marketData.type}` : "Check Price Hub"}
                        </span>
                    </div>

                    <p className="result-reasoning">{res.reason || "Optimal soil match detected."}</p>
                    
                    {index === 0 && (
                        <div className="top-choice-tag">PREMIUM CHOICE</div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="results-footer-hint">Diversity reduces risk. Consider allocating 70% to your #1 choice.</p>
          </div>
        ) : (
          <div className="initial-result-view fade-in">
            <div className="scan-icon-container">
              <div className="scan-line"></div>
              <span className="scan-emoji">🧬</span>
            </div>
            <h2>Ready for Analysis</h2>
            <p>Configure the soil parameters to generate your top-3 high-precision crop recommendations.</p>
            <div className="status-badge">System Standby</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Result
