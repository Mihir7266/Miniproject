const Help = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Help Center</h1>
          <p className="text-gray-600 dark:text-gray-300">Get answers, quickly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold mb-2">Order Issues</h3>
            <p className="text-gray-600 dark:text-gray-300">For missing items or delays, contact support with your order number.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Account & Login</h3>
            <p className="text-gray-600 dark:text-gray-300">Reset passwords and manage your profile in the account page.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Payments & Refunds</h3>
            <p className="text-gray-600 dark:text-gray-300">Refunds are processed in 5-7 business days to your source method.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Reservations</h3>
            <p className="text-gray-600 dark:text-gray-300">Modify or cancel reservations from your Orders/Reservations page.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help


