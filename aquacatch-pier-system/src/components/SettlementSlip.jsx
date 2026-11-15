import React from 'react';

function SettlementSlip({
  transaction,
  transactions,
  onSelectTransaction,
  onGoToIntake,
  onGoToLedger
}) {
  if (!transaction) {
    return (
      <section className="view-section">
        <div className="surface-box empty-box">
          <svg className="empty-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7V16C12 18.8 14.2 21 17 21C19.8 21 22 18.8 22 16V13" />
            <path d="M19 15L22 12" />
          </svg>
          <h2>No Settlement Voucher Active</h2>
          <p>Record a catch unloading at the intake desk to generate a disbursement slip.</p>
          <button type="button" className="btn-cta-inline" onClick={onGoToIntake}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Go to Weigh &amp; Intake</span>
          </button>
        </div>
      </section>
    );
  }

  const isFresh = transaction.classification === 'Fresh Catch (Chilled)';
  const rateText = isFresh ? '3.0%' : '1.5%';

  return (
    <section className="view-section">
      <div className="page-header-row">
        <div>
          <h1 className="page-headline">Official Pier Settlement Voucher</h1>
          <p className="page-subline">
            Verified harbor weight and disbursement computation for vessel captain sign-off.
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn-secondary" onClick={onGoToIntake}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Unloading</span>
          </button>
          <button type="button" className="btn-secondary" onClick={onGoToLedger}>
            <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>View Full Ledger</span>
          </button>
        </div>
      </div>

      <div className="voucher-workspace">
        <aside className="surface-box voucher-selector">
          <div className="section-title-row">
            <svg className="svg-icon section-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 17L4.5 20.5C5.3 21.5 6.5 22 7.8 22H16.2C17.5 22 18.7 21.5 19.5 20.5L22 17H2Z" />
              <path d="M12 3V17" />
              <path d="M12 4L19 14H12" />
            </svg>
            <h2 className="section-title">Select Logged Vessel</h2>
          </div>

          <ul className="voucher-nav-list">
            {transactions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`voucher-Switch-btn ${item.id === transaction.id ? 'voucher-Switch-active' : ''}`}
                  onClick={() => onSelectTransaction(item.id)}
                >
                  <div className="switch-top">
                    <strong>{item.vesselName}</strong>
                    <span className="mono-text">{item.id}</span>
                  </div>
                  <div className="switch-bottom">
                    <span>{item.species}</span>
                    <strong>
                      PHP {item.netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="surface-box voucher-stage">
          <div className="voucher-paper">
            <div className="voucher-head">
              <div className="voucher-crest">
                <svg className="svg-icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 17L4.5 20.5C5.3 21.5 6.5 22 7.8 22H16.2C17.5 22 18.7 21.5 19.5 20.5L22 17H2Z" />
                  <path d="M12 3V17" />
                  <path d="M12 4L19 14H12" />
                  <path d="M12 6L6 14H12" />
                </svg>
              </div>
              <strong>AQUACATCH MUNICIPAL FISH PORT</strong>
              <span>PIER 1 • SETTLEMENT DISBURSEMENT VOUCHER</span>
              <div className="voucher-meta">
                <span>REF: {transaction.id}</span>
                <span>TIME: {transaction.timestamp}</span>
              </div>
            </div>

            <div className="voucher-rule">------------------------------------------------</div>

            <div className="voucher-group">
              <div className="voucher-row">
                <span>VESSEL</span>
                <strong>{transaction.vesselName}</strong>
              </div>
              <div className="voucher-row">
                <span>CAPTAIN / OWNER</span>
                <span>{transaction.captainName}</span>
              </div>
              <div className="voucher-row">
                <span>CHANNEL</span>
                <span>{transaction.salesChannel}</span>
              </div>
              <div className="voucher-row">
                <span>HANDLING CLASS</span>
                <span>{transaction.classification}</span>
              </div>
            </div>

            <div className="voucher-rule">------------------------------------------------</div>

            <div className="voucher-group">
              <div className="voucher-row">
                <span>SPECIES GRADE</span>
                <strong>{transaction.species}</strong>
              </div>
              <div className="voucher-row">
                <span>GROSS SCALE WEIGHT</span>
                <span>{transaction.grossWeight.toFixed(2)} kg</span>
              </div>
              <div className="voucher-row">
                <span>CRATE TARE DEDUCTION</span>
                <span>- {transaction.tareWeight.toFixed(2)} kg</span>
              </div>
              <div className="voucher-row voucher-emphasis">
                <span>NET BILLABLE WEIGHT</span>
                <strong>{transaction.netWeight.toFixed(2)} kg</strong>
              </div>
              <div className="voucher-row">
                <span>UNIT PRICE PER KG</span>
                <span>PHP {transaction.pricePerKg.toFixed(2)}</span>
              </div>
            </div>

            <div className="voucher-rule">------------------------------------------------</div>

            <div className="voucher-group">
              <div className="voucher-row">
                <span>GROSS CATCH AMOUNT</span>
                <strong>
                  PHP {transaction.grossAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
              <div className="voucher-row">
                <span>DOCK FEE ({rateText} + AUX)</span>
                <span>
                  - PHP {transaction.dockFee.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="voucher-row voucher-muted">
                <span>{transaction.auxLabel}</span>
                <span>
                  {isFresh ? `${transaction.auxValue} units` : `PHP ${Number(transaction.auxValue).toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="voucher-rule">================================================</div>

            <div className="voucher-net-banner">
              <span>NET VESSEL PAYOUT</span>
              <strong>
                PHP {transaction.netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>

            <div className="voucher-foot">
              <span>ATTESTED BY: HARBOR WEIGHMASTER</span>
              <span>CLEARED FOR CASH DISBURSEMENT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SettlementSlip;