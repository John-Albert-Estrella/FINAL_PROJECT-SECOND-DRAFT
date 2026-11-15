import React, { useState } from 'react';
import IntakeForm from './components/intakeForm';
import SettlementSlip from './components/SettlementSlip';
import LedgerTable from './components/LedgerTable';
import appIcon from './assets/ICON_aquaCatch.png'; // Change .png to .jpg/.svg if needed
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTrxId, setSelectedTrxId] = useState(null);
  const [activePage, setActivePage] = useState('intake');
  const [toast, setToast] = useState(null);

  const triggerToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  };

  const handleAddTransaction = (newTrx) => {
    setTransactions((prev) => [newTrx, ...prev]);
    setSelectedTrxId(newTrx.id);
    setActivePage('voucher');
    triggerToast(`Settlement ${newTrx.id} generated for ${newTrx.vesselName}`);
  };

  const handleDeleteTransaction = (id) => {
    const updated = transactions.filter((trx) => trx.id !== id);
    setTransactions(updated);
    if (selectedTrxId === id) {
      setSelectedTrxId(updated.length > 0 ? updated[0].id : null);
    }
    triggerToast(`Removed record ${id} from harbor ledger`);
  };

  const handleInspectTransaction = (id) => {
    setSelectedTrxId(id);
    setActivePage('voucher');
  };

  const activeTransaction =
    transactions.find((trx) => trx.id === selectedTrxId) || transactions[0] || null;

  const totals = transactions.reduce(
    (acc, item) => ({
      netWeight: acc.netWeight + item.netWeight,
      grossAmount: acc.grossAmount + item.grossAmount,
      dockFee: acc.dockFee + item.dockFee,
      netPayout: acc.netPayout + item.netPayout
    }),
    { netWeight: 0, grossAmount: 0, dockFee: 0, netPayout: 0 }
  );

  return (
    <div className="app-layout">
      <header className="top-navbar">
        <div className="navbar-inner">
          <div className="brand-identity">
            <div className="brand-logo-badge">
              <img
                src={appIcon}
                alt="AquaCatch Logo"
                className="brand-logo-img"
              />
            </div>
            <div>
              <strong className="brand-title">AquaCatch</strong>
              <span className="brand-divider">/</span>
              <span className="brand-sub">Pier Settlement Terminal</span>
            </div>
          </div>

          <nav className="nav-tabs" aria-label="Primary Workspace Navigation">
            <button
              type="button"
              className={`nav-link ${activePage === 'intake' ? 'nav-link-active' : ''}`}
              onClick={() => setActivePage('intake')}
            >
              <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7V16C12 18.8 14.2 21 17 21C19.8 21 22 18.8 22 16V13" />
                <path d="M19 15L22 12" />
              </svg>
              <span>1. Weigh &amp; Intake</span>
            </button>

            <button
              type="button"
              className={`nav-link ${activePage === 'voucher' ? 'nav-link-active' : ''}`}
              onClick={() => setActivePage('voucher')}
            >
              <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 2V22L6 20L8 22L10 20L12 22L14 20L16 22L18 20L20 22V2L18 4L16 2L14 4L12 2L10 4L8 2L6 4L4 2Z" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="16" y2="14" />
              </svg>
              <span>2. Settlement Voucher</span>
            </button>

            <button
              type="button"
              className={`nav-link ${activePage === 'ledger' ? 'nav-link-active' : ''}`}
              onClick={() => setActivePage('ledger')}
            >
              <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <line x1="9" y1="10" x2="9" y2="20" />
              </svg>
              <span>3. Harbor Ledger ({transactions.length})</span>
            </button>
          </nav>

          <div className="navbar-kpi">
            <span className="kpi-caption">Disbursed Today</span>
            <strong className="kpi-amount">
              PHP {totals.netPayout.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </div>
        </div>
      </header>

      {toast && (
        <div className="feedback-toast" role="status">
          <svg className="svg-icon toast-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toast}</span>
        </div>
      )}

      <main className="page-container">
        {activePage === 'intake' && (
          <IntakeForm
            onAddTransaction={handleAddTransaction}
            onViewLedger={() => setActivePage('ledger')}
          />
        )}

        {activePage === 'voucher' && (
          <SettlementSlip
            transaction={activeTransaction}
            transactions={transactions}
            onSelectTransaction={setSelectedTrxId}
            onGoToIntake={() => setActivePage('intake')}
            onGoToLedger={() => setActivePage('ledger')}
            appIcon={appIcon}
          />
        )}

        {activePage === 'ledger' && (
          <LedgerTable
            transactions={transactions}
            selectedId={activeTransaction ? activeTransaction.id : null}
            onSelectTransaction={handleInspectTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onGoToIntake={() => setActivePage('intake')}
            totals={totals}
          />
        )}
      </main>
    </div>
  );
}

export default App;