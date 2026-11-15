import React, { useState } from 'react';

function LedgerTable({
  transactions,
  selectedId,
  onSelectTransaction,
  onDeleteTransaction,
  onGoToIntake,
  totals
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter(
    (trx) =>
      trx.vesselName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.captainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="view-section">
      <div className="page-header-row">
        <div>
          <h1 className="page-headline">Harbor Settlement Ledger</h1>
          <p className="page-subline">
            Complete audit trail of weighed catches, port dock fees, and net vessel disbursements.
          </p>
        </div>
        <button type="button" className="btn-cta-inline" onClick={onGoToIntake}>
          <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Log New Vessel</span>
        </button>
      </div>

      <div className="kpi-grid-4">
        <div className="surface-box kpi-tile">
          <div className="kpi-top-row">
            <span className="kpi-label">Cleared Vessels</span>
            <svg className="svg-icon kpi-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 17L4.5 20.5C5.3 21.5 6.5 22 7.8 22H16.2C17.5 22 18.7 21.5 19.5 20.5L22 17H2Z" />
              <path d="M12 3V17" />
              <path d="M12 4L19 14H12" />
            </svg>
          </div>
          <strong className="kpi-figure">{transactions.length}</strong>
        </div>

        <div className="surface-box kpi-tile">
          <div className="kpi-top-row">
            <span className="kpi-label">Total Net Catch</span>
            <svg className="svg-icon kpi-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7V16C12 18.8 14.2 21 17 21C19.8 21 22 18.8 22 16V13" />
              <path d="M19 15L22 12" />
            </svg>
          </div>
          <strong className="kpi-figure">{totals.netWeight.toFixed(2)} kg</strong>
        </div>

        <div className="surface-box kpi-tile">
          <div className="kpi-top-row">
            <span className="kpi-label">Collected Dock Fees</span>
            <svg className="svg-icon kpi-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="3" />
              <line x1="12" y1="22" x2="12" y2="8" />
              <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
            </svg>
          </div>
          <strong className="kpi-figure">
            PHP {totals.dockFee.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </strong>
        </div>

        <div className="surface-box kpi-tile kpi-tile-accent">
          <div className="kpi-top-row">
            <span className="kpi-label">Total Net Disbursed</span>
            <svg className="svg-icon kpi-svg-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <strong className="kpi-figure">
            PHP {totals.netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </strong>
        </div>
      </div>

      <div className="surface-box ledger-box">
        <div className="ledger-toolbar">
          <div className="search-input-wrap">
            <svg className="svg-icon search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="search-box"
              placeholder="Filter by reference ID, vessel, captain, or species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter harbor ledger"
            />
          </div>
          <span className="toolbar-count">
            Showing {filtered.length} of {transactions.length} records
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-box">
            <svg className="empty-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 17L4.5 20.5C5.3 21.5 6.5 22 7.8 22H16.2C17.5 22 18.7 21.5 19.5 20.5L22 17H2Z" />
              <path d="M12 3V17" />
              <path d="M12 4L19 14H12" />
            </svg>
            <h2>No Vessel Records Logged Yet</h2>
            <p>Log your first vessel unloading to populate the harbor settlement ledger.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Vessel &amp; Captain</th>
                  <th>Species &amp; Class</th>
                  <th>Channel</th>
                  <th className="num">Net Wt</th>
                  <th className="num">Rate / kg</th>
                  <th className="num">Gross Value</th>
                  <th className="num">Dock Fee</th>
                  <th className="num">Net Payout</th>
                  <th className="num">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((trx) => (
                  <tr
                    key={trx.id}
                    className={trx.id === selectedId ? 'row-selected' : ''}
                    onClick={() => onSelectTransaction(trx.id)}
                  >
                    <td className="mono-text">
                      <strong>{trx.id}</strong>
                      <span className="cell-sub">{trx.timestamp}</span>
                    </td>
                    <td>
                      <strong>{trx.vesselName}</strong>
                      <span className="cell-sub">{trx.captainName}</span>
                    </td>
                    <td>
                      <strong>{trx.species}</strong>
                      <span className="cell-sub">{trx.classification}</span>
                    </td>
                    <td>{trx.salesChannel}</td>
                    <td className="num">{trx.netWeight.toFixed(2)} kg</td>
                    <td className="num">PHP {trx.pricePerKg.toFixed(2)}</td>
                    <td className="num">
                      PHP {trx.grossAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="num text-danger">
                      - PHP {trx.dockFee.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="num text-accent-bold">
                      PHP {trx.netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="num">
                      <button
                        type="button"
                        className="btn-row-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTransaction(trx.id);
                        }}
                      >
                        <svg className="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">
                    <strong>Harbor Session Totals</strong>
                  </td>
                  <td className="num">
                    <strong>{totals.netWeight.toFixed(2)} kg</strong>
                  </td>
                  <td className="num">—</td>
                  <td className="num">
                    <strong>
                      PHP {totals.grossAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </td>
                  <td className="num text-danger">
                    <strong>
                      - PHP {totals.dockFee.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </td>
                  <td className="num text-accent-bold">
                    <strong>
                      PHP {totals.netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default LedgerTable;