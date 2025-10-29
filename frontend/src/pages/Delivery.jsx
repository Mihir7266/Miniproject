const Delivery = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Delivery</h1>
          <p className="text-gray-600 dark:text-gray-300">Fast and fresh to your door.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-semibold mb-1">Areas</h3>
            <p className="text-gray-600 dark:text-gray-300">Garden City, Riverside, North Point</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-1">Timing</h3>
            <p className="text-gray-600 dark:text-gray-300">11:00 AM – 10:00 PM (last order 9:30 PM)</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-1">Fees</h3>
            <p className="text-gray-600 dark:text-gray-300">Free above ₹500, else ₹49</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Delivery


