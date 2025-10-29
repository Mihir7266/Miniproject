const Catering = () => {
  const packages = [
    { name: 'Lite Lunch', serves: '10-12', price: '₹4,999' },
    { name: 'Family Feast', serves: '20-24', price: '₹9,499' },
    { name: 'Grand Spread', serves: '40-50', price: '₹17,999' }
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Catering</h1>
          <p className="text-gray-600 dark:text-gray-300">Fresh, seasonal menus for meetings and celebrations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {packages.map((p, i) => (
            <div key={i} className="card text-center">
              <h3 className="text-xl font-semibold mb-1">{p.name}</h3>
              <p className="text-gray-500">Serves {p.serves}</p>
              <div className="text-2xl font-bold mt-3">{p.price}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-3">Customize Your Menu</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Vegetarian, vegan, gluten-free—tell us your preferences.</p>
          <a href="mailto:catering@gardengrains.com" className="btn-primary">Get a Quote</a>
        </div>
      </div>
    </div>
  )
}

export default Catering


