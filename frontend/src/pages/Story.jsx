const Story = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Our Story</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From a tiny kitchen to a community favorite, Garden Grains was built on the belief that
            food can be both incredibly delicious and deeply nourishing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">2018 • The Spark</h3>
            <p className="text-gray-600 dark:text-gray-300">We started as a weekend pop-up with five signature bowls and a dream.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">2020 • Our Kitchen</h3>
            <p className="text-gray-600 dark:text-gray-300">Opened our first kitchen and began partnering with local farms.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">2024 • Today</h3>
            <p className="text-gray-600 dark:text-gray-300">A full menu, online ordering, and a vibrant community around real food.</p>
          </div>
        </div>

        <div className="card mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Make wholesome eating joyful and accessible. Every dish is crafted with seasonal produce,
            whole grains, and bold flavors—clearly labeled for dietary needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{
            title: 'Sourcing',
            desc: 'Local organic farms, ethically produced staples, transparent supply chains.'
          }, {
            title: 'Craft',
            desc: 'House-made sauces, slow cooking where it matters, crisp where it counts.'
          }, {
            title: 'Care',
            desc: 'Clear allergens, balanced nutrition, and options for every preference.'
          }].map((v, i) => (
            <div key={i} className="card">
              <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Story


