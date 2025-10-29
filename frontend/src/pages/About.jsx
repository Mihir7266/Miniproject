import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Garden Grains</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are a vegetarian-first kitchen serving fresh, wholesome, and delicious meals crafted from locally sourced, seasonal ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Philosophy</h2>
            <p className="text-gray-700 leading-relaxed">
              At Garden Grains, we believe great food starts at the farm. Our chefs craft vibrant vegetarian dishes that are as nourishing as they are flavorful. We focus on sustainability, traceability, and cooking with care.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quality Ingredients</h2>
            <p className="text-gray-700 leading-relaxed">
              We partner with local growers for organic produce and whole grains. Every dish is free from artificial colors and preservatives, with clear labeling for allergens and nutrition.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Visit Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
              <p className="text-gray-700">Mon-Sun: 11:00 AM – 11:00 PM</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-gray-700">Garden Grains, City Center, Your Town</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Contact</h3>
              <p className="text-gray-700">support@gardengrains.example</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/menu" className="btn-primary px-8 py-3 text-lg">
            Explore Our Menu
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About


