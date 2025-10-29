const FAQ = () => {
  const faqs = [
    { q: 'Do you offer vegan options?', a: 'Yes, many dishes are vegan and clearly labeled. You can also filter the menu.' },
    { q: 'Can I customize my order?', a: 'Absolutely. Choose add-ons and customizations available on each menu item.' },
    { q: 'What are your delivery areas?', a: 'Garden City, Riverside, and North Point. See Delivery for details.' },
    { q: 'How do refunds work?', a: 'Eligible refunds are processed back to the original payment method within 5-7 business days.' }
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-600 dark:text-gray-300">Quick answers to common questions.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="card">
              <div className="font-semibold mb-1">{f.q}</div>
              <div className="text-gray-600 dark:text-gray-300">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ


