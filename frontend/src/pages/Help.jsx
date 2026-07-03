const faqs = [
  {
    q: 'How does Fraud Shield protect my orders?',
    a: 'Every checkout is analyzed in real time using machine learning models trained on transaction patterns. We evaluate amount, velocity, device signals, and address consistency.',
  },
  {
    q: 'What happens if my order is flagged?',
    a: 'Flagged orders are placed under review. You will see an "under review" status while our admin team verifies the transaction. Legitimate orders are typically approved quickly.',
  },
  {
    q: 'Why was my payment blocked?',
    a: 'Payments may be blocked when multiple high-risk signals combine — such as a new account, unusual order amount, address mismatch, and rapid repeat purchases.',
  },
  {
    q: 'Is my payment information stored?',
    a: 'This is a demo application. Payment details are not stored or processed by a real payment gateway.',
  },
];

export default function Help() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-3xl font-bold">Help Center</h1>
      <p className="mt-2 text-slate-600">
        Learn how FraudShield uses data mining to detect suspicious e-commerce transactions in real time.
      </p>

      <section className="mt-8 space-y-4">
        {faqs.map((item) => (
          <div key={item.q} className="card">
            <h3 className="font-semibold">{item.q}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.a}</p>
          </div>
        ))}
      </section>

      <section className="card mt-8">
        <h2 className="text-xl font-bold">Contact Us</h2>
        <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input className="input" placeholder="Your email" type="email" />
          <textarea className="input" rows={4} placeholder="How can we help?" />
          <button className="btn-primary">Send Message</button>
        </form>
      </section>

      <section className="card mt-8 bg-brand-50">
        <h2 className="font-bold">Fraud Detection Signals</h2>
        <ul className="mt-3 list-inside list-disc text-sm text-slate-700">
          <li>Transaction amount and spending patterns</li>
          <li>Account age and order velocity (orders per 24h)</li>
          <li>Shipping vs billing address mismatch</li>
          <li>IP geolocation mismatch and new device flags</li>
          <li>Time-of-day anomalies (night transactions)</li>
        </ul>
      </section>
    </div>
  );
}
