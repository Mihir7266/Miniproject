const Contact = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-300">We’d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card"><div className="font-semibold mb-1">Email</div><div className="text-gray-600 dark:text-gray-300">info@gardengrains.com</div></div>
          <div className="card"><div className="font-semibold mb-1">Phone</div><div className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</div></div>
          <div className="card"><div className="font-semibold mb-1">Address</div><div className="text-gray-600 dark:text-gray-300">123 Green Street, Garden City</div></div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-3">Send a Message</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Your name" />
            <input className="input-field" placeholder="Email" type="email" />
            <input className="input-field md:col-span-2" placeholder="Subject" />
            <textarea className="input-field md:col-span-2" rows="4" placeholder="Message"></textarea>
            <div className="md:col-span-2 flex justify-end">
              <button type="button" className="btn-primary">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact


