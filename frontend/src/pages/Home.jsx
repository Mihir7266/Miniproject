import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { menuAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { 
  StarIcon, 
  ClockIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

const Home = () => {
  const { addItem } = useCart()
  const [featuredItems, setFeaturedItems] = useState([])

  // Fetch featured menu items
  const { data: menuData, isLoading } = useQuery(
    'featured-menu',
    () => menuAPI.getMenu({ isFeatured: 'true', limit: 6 }),
    {
      onSuccess: (data) => {
        setFeaturedItems(data.data.menuItems)
      }
    }
  )

  const features = [
    {
      icon: ClockIcon,
      title: 'Fast Service',
      description: 'Fresh meals prepared and served within 15-20 minutes'
    },
    {
      icon: TruckIcon,
      title: 'Free Delivery',
      description: 'Complimentary delivery for orders above ₹500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assured',
      description: '100% organic ingredients sourced from local farms'
    },
    {
      icon: HeartIcon,
      title: 'Healthy Options',
      description: 'Nutritious meals for every dietary preference'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Food Blogger',
      content: 'The freshest ingredients and most flavorful dishes I\'ve ever tasted. Garden Grains has become my go-to restaurant!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Regular Customer',
      content: 'Excellent service and amazing food. The online ordering system is so convenient and user-friendly.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Health Enthusiast',
      content: 'Finally found a restaurant that understands healthy eating without compromising on taste!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ]

  const handleAddToCart = (menuItem) => {
    addItem(menuItem, 1)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=60')] opacity-20 bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fresh, Healthy & 
              <span className="block text-secondary-300">Delicious</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Experience farm-to-table dining with our carefully crafted menu of organic, 
              nutritious, and absolutely delicious meals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/menu"
                className="btn-secondary text-lg px-8 py-3"
              >
                Order Now
              </Link>
              <Link
                to="/reservations"
                className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600"
              >
                Make Reservation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Garden Grains?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best dining experience through quality, 
              service, and innovation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center card">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Dishes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated menu items, 
              carefully crafted by our expert chefs.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="menu-item-card animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <div key={item._id} className="menu-item-card group">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.images?.[0]?.url || '/api/placeholder/300/200'}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                        <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium">{item.ratings.average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="btn-primary"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="btn-primary text-lg px-8 py-3"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center justify-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="h-8 w-8 text-secondary-300 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Experience Excellence?</h2>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made Garden Grains their favorite dining destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="btn-secondary text-lg px-8 py-3"
            >
              Start Ordering
            </Link>
            <Link
              to="/reservations"
              className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
