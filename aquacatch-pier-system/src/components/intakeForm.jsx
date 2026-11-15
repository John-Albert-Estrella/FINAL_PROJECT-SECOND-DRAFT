import React, { useState } from 'react';

const SPECIES_RATES = {
  'Yellowfin / Pelagic': 280.0,
  'Trevally (Talakitok)': 220.0,
  'Mackerel (Salay-Salay)': 160.0,
  'Rabbitfish (Kitang)': 190.0,
  'Shrimps / Crustaceans': 350.0
};

function IntakeForm({ onAddTransaction, onViewLedger }) {
  const [vesselName, setVesselName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [classification, setClassification] = useState('Fresh Catch (Chilled)');
  const [species, setSpecies] = useState('Yellowfin / Pelagic');
  const [grossWeight, setGrossWeight] = useState('');
  const [tareWeight, setTareWeight] = useState('2.0');
  const [pricePerKg, setPricePerKg] = useState('280.00');
  const [salesChannel, setSalesChannel] = useState('Wholesale Auction');
  const [auxValue, setAuxValue] = useState('0');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClassificationChange = (e) => {
    const nextClass = e.target.value;
    setClassification(nextClass);
    setAuxValue(nextClass === 'Fresh Catch (Chilled)' ? '0' : '50.00');
  };

  const handleSpeciesChange = (e) => {
    const selected = e.target.value;
    setSpecies(selected);
    setPricePerKg(SPECIES_RATES[selected].toFixed(2));
  };

  const parsedGross = parseFloat(grossWeight) || 0;
  const parsedTare = parseFloat(tareWeight) || 0;
  const parsedPrice = parseFloat(pricePerKg) || 0;
  const parsedAux = parseFloat(auxValue) || 0;

  const isFresh = classification === 'Fresh Catch (Chilled)';
  const netWeight = parsedGross > parsedTare ? parsedGross - parsedTare : 0;
  const grossAmount = netWeight * parsedPrice;
  const commissionFee = grossAmount * (isFresh ? 0.03 : 0.015);
  const auxFee = netWeight > 0 ? (isFresh ? parsedAux * 45.0 : parsedAux) : 0;
  const dockFee = commissionFee + auxFee;
  const netPayout = Math.max(0, grossAmount - dockFee);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!vesselName.trim() || !captainName.trim()) {
      setErrorMsg('Enter both the Vessel Name and Captain / Owner name.');
      return;
    }

    if (parsedGross - parsedTare <= 0) {
      setErrorMsg('Net Weight must be greater than 0 kg (Gross Weight must exceed Tare Weight).');
      return;
    }

    if (parsedPrice <= 0) {
      setErrorMsg('Unit Price Per Kilo must be greater than PHP 0.00.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const cleanAux = isFresh
        ? Math.max(0, parseInt(auxValue, 10) || 0)
        : Math.max(0, parseFloat(auxValue) || 0);

      const finalGrossAmt = (parsedGross - parsedTare) * parsedPrice;
      const finalDockFee = isFresh
        ? finalGrossAmt * 0.03 + cleanAux * 45.0
        : finalGrossAmt * 0.015 + cleanAux;

      const newTransaction = {
        id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        vesselName: vesselName.trim(),
        captainName: captainName.trim(),
        classification,
        species,
        grossWeight: parsedGross,
        tareWeight: parsedTare,
        netWeight: parsedGross - parsedTare,
        pricePerKg: parsedPrice,
        salesChannel,
        auxLabel: isFresh ? 'Ice Boxes Count' : 'Handling Surcharge (PHP)',
        auxValue: cleanAux,
        grossAmount: finalGrossAmt,
        dockFee: finalDockFee,
        netPayout: finalGrossAmt - finalDockFee
      };

      setIsSubmitting(false);
      setVesselName('');
      setCaptainName('');
      setGrossWeight('');
      setTareWeight('2.0');
      setAuxValue(isFresh ? '0' : '50.00');
      onAddTransaction(newTransaction);
    }, 320);
  };

  return (
    <section className="view-section">
      <div className="page-header-row">
        <div>
          <h1 className="page-headline">Calculate Vessel Catch Settlement</h1>
          <p className="page-subline">
            Record pier scale weights and dock deductions to issue an official disbursement slip.
          </p>
        </div>
        <button type="button" className="btn-secondary" onClick={onViewLedger}>
          <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="9" y1="10" x2="9" y2="20" />
          </svg>
          <span>Open Harbor Ledger</span>
          <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {errorMsg && <div className="error-callout">{errorMsg}</div>}

      <div className="intake-workspace">
        <form onSubmit={handleSubmit} className="surface-box form-stack">
          <div className="field-section">
            <div className="section-title-row">
              {/* Boat Hull Vector Icon */}
              <svg className="svg-icon section-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 17L4.5 20.5C5.3 21.5 6.5 22 7.8 22H16.2C17.5 22 18.7 21.5 19.5 20.5L22 17H2Z" />
                <path d="M6 17V11L12 7L18 11V17" />
                <line x1="12" y1="3" x2="12" y2="7" />
              </svg>
              <h2 className="section-title">Vessel &amp; Unloading Registry</h2>
            </div>

            <div className="grid-2">
              <div className="field">
                <label htmlFor="vesselName">Vessel Name</label>
                <input
                  id="vesselName"
                  type="text"
                  placeholder="Enter vessel name"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="captainName">Captain or Owner</label>
                <input
                  id="captainName"
                  type="text"
                  placeholder="Enter captain or owner"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="field-section">
            <div className="section-title-row">
              {/* Fishing Hook Vector Icon */}
              <svg className="svg-icon section-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7V16C12 18.8 14.2 21 17 21C19.8 21 22 18.8 22 16V13" />
                <path d="M19 15L22 12" />
              </svg>
              <h2 className="section-title">Catch Classification &amp; Pricing</h2>
            </div>

            <div className="grid-2">
              <div className="field">
                <label htmlFor="classification">Handling Class</label>
                <select
                  id="classification"
                  value={classification}
                  onChange={handleClassificationChange}
                >
                  <option value="Fresh Catch (Chilled)">Fresh Catch (Chilled)</option>
                  <option value="Processed / Dried Catch">Processed / Dried Catch</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="species">Species Grade</label>
                <select
                  id="species"
                  value={species}
                  onChange={handleSpeciesChange}
                >
                  {Object.keys(SPECIES_RATES).map((sp) => (
                    <option key={sp} value={sp}>
                      {sp} — PHP {SPECIES_RATES[sp].toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-3">
              <div className="field">
                <label htmlFor="grossWeight">Gross Weight (kg)</label>
                <input
                  id="grossWeight"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="0.0"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="tareWeight">Crate Tare (kg)</label>
                <input
                  id="tareWeight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={tareWeight}
                  onChange={(e) => setTareWeight(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="pricePerKg">Price / kg (PHP)</label>
                <input
                  id="pricePerKg"
                  type="number"
                  step="0.50"
                  min="1"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="field-section">
            <div className="section-title-row">
              {/* Anchor / Harbor Tariff Vector Icon */}
              <svg className="svg-icon section-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3" />
                <line x1="12" y1="22" x2="12" y2="8" />
                <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
              </svg>
              <h2 className="section-title">Port Channel &amp; Auxiliary Deductions</h2>
            </div>

            <div className="grid-2">
              <div className="field">
                <label>Sales Channel</label>
                <div className="segmented-radios">
                  {['Wholesale Auction', 'Consignment', 'Direct Pier Sale'].map((ch) => (
                    <label
                      key={ch}
                      className={`radio-card ${salesChannel === ch ? 'radio-card-selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="salesChannel"
                        value={ch}
                        checked={salesChannel === ch}
                        onChange={(e) => setSalesChannel(e.target.value)}
                      />
                      <span>{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="auxInput">
                  {isFresh ? 'Ice Boxes Count' : 'Handling Surcharge (PHP)'}
                </label>
                <input
                  id="auxInput"
                  type="number"
                  step={isFresh ? '1' : '0.50'}
                  min="0"
                  value={auxValue}
                  onChange={(e) => setAuxValue(e.target.value)}
                  required
                />
                <span className="field-note">
                  {isFresh
                    ? '3% harbor commission + PHP 45.00 per chilled box'
                    : '1.5% harbor commission + flat handling fee'}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-cta" disabled={isSubmitting}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <span>{isSubmitting ? 'Computing Settlement...' : 'Issue Settlement Voucher'}</span>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        <aside className="surface-box estimator-card">
          {/* Decorative Nautical Hook Watermark */}
          <svg className="watermark-hook" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="4" r="2" />
            <path d="M12 6V16C12 19.3 14.7 22 18 22C21.3 22 24 19.3 24 16V12" />
            <path d="M20 15L24 11" />
          </svg>

          <div className="estimator-header">
            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 17L4.5 20.5C5.3 21.5 6.5 22 7.8 22H16.2C17.5 22 18.7 21.5 19.5 20.5L22 17H2Z" />
              <path d="M12 3V17" />
              <path d="M12 4L19 14H12" />
            </svg>
            <span className="estimator-kicker">LIVE PAYOUT ESTIMATOR</span>
          </div>

          <div className="estimator-hero">
            <span className="estimator-label">Estimated Net Vessel Payout</span>
            <strong className="estimator-payout">
              PHP {netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </div>

          <div className="estimator-rows">
            <div className="est-row">
              <span>Net Billable Weight</span>
              <strong>{netWeight.toFixed(2)} kg</strong>
            </div>
            <div className="est-row">
              <span>Gross Catch Value</span>
              <strong>
                PHP {grossAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="est-row est-deduct">
              <span>Harbor Tariff ({isFresh ? '3%' : '1.5%'})</span>
              <span>- PHP {commissionFee.toFixed(2)}</span>
            </div>
            <div className="est-row est-deduct">
              <span>{isFresh ? `Ice Storage (${parsedAux} boxes)` : 'Handling Surcharge'}</span>
              <span>- PHP {auxFee.toFixed(2)}</span>
            </div>
            <div className="est-row est-total-deduct">
              <span>Total Port Dock Fee</span>
              <strong>- PHP {dockFee.toFixed(2)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default IntakeForm;