export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1>QuickLendX</h1>
        <p className="tagline">Invoice-lending on Stellar. Suppliers get paid faster; investors get on-chain yield.</p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#invoices">Browse invoices</a>
          <a className="btn btn-secondary" href="#docs">Read the docs</a>
        </div>
      </section>

      <section className="highlights">
        <article>
          <h2>For suppliers</h2>
          <p>Post an invoice, receive a bid, get funded in the same ledger close.</p>
        </article>
        <article>
          <h2>For investors</h2>
          <p>Bid on rated invoices with transparent risk data. Repayments settle directly on-chain.</p>
        </article>
        <article>
          <h2>Open source</h2>
          <p>Every contract, indexer, and page in this UI is auditable in public repos.</p>
        </article>
      </section>

      <footer>
        <p>&copy; QuickLendX · <a href="https://github.com/QuickLendX">GitHub</a></p>
      </footer>
    </main>
  );
}
