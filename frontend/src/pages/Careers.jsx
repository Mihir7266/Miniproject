const Careers = () => {
  const openings = [
    { title: 'Sous Chef', type: 'Full-time', location: 'On-site • Garden City' },
    { title: 'Line Cook', type: 'Full-time', location: 'On-site • Garden City' },
    { title: 'Customer Experience Associate', type: 'Part-time', location: 'Hybrid' },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Careers</h1>
          <p className="text-gray-600 dark:text-gray-300">Join a team crafting food with purpose.</p>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-3">Life at Garden Grains</h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Fair pay and shared tips</li>
            <li>Staff meals and wellness benefits</li>
            <li>Growth paths across kitchen and operations</li>
          </ul>
        </div>

        <div className="space-y-4">
          {openings.map((job, i) => (
            <div key={i} className="card flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.type} • {job.location}</p>
              </div>
              <a href="mailto:careers@gardengrains.com" className="btn-primary">Apply</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Careers


