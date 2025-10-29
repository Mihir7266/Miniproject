import { useState } from 'react'
import { useQuery } from 'react-query'
import { menuAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  StarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

const Menu = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dietary: 'vegetarian',
    priceRange: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const { addItem } = useCart()

  const { data: menuData, isLoading, error } = useQuery(
    ['menu', filters],
    () => menuAPI.getMenu(filters),
    {
      keepPreviousData: true
    }
  )

  const { data: categoriesData } = useQuery(
    'menu-categories',
    () => menuAPI.getCategories()
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAddToCart = (menuItem) => {
    addItem(menuItem, 1)
  }

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'appetizers', label: 'Appetizers' },
    { value: 'main-course', label: 'Main Course' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'salads', label: 'Salads' },
    { value: 'soups', label: 'Soups' },
    { value: 'specials', label: 'Specials' }
  ]

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian' }
  ]

  const priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '0-200', label: 'Under ₹200' },
    { value: '200-500', label: '₹200 - ₹500' },
    { value: '500-1000', label: '₹500 - ₹1000' },
    { value: '1000-', label: 'Above ₹1000' }
  ]

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Menu</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully crafted selection of fresh, healthy, and delicious meals
          </p>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {[
            { label: 'All', value: '' },
            { label: 'Appetizers', value: 'appetizers' },
            { label: 'Main Course', value: 'main-course' },
            { label: 'Desserts', value: 'desserts' },
            { label: 'Beverages', value: 'beverages' },
            { label: 'Salads', value: 'salads' },
            { label: 'Soups', value: 'soups' },
            { label: 'Specials', value: 'specials' }
          ].map((c) => (
            <button
              key={c.value || 'all'}
              onClick={() => handleFilterChange('category', c.value)}
              className={`chip ${filters.category === c.value ? 'chip-active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

            {/* Advanced Filters (dietary locked to vegetarian) */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dietary Filter is fixed to Vegetarian */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary
                  </label>
                  <input
                    type="text"
                    value="Vegetarian only"
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg"
                  />
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-')
                      handleFilterChange('sortBy', sortBy)
                      handleFilterChange('sortOrder', sortOrder)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low-High</option>
                    <option value="price-desc">Price High-Low</option>
                    <option value="ratings.average-desc">Rating High-Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="menu-item-card animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {menuData?.data?.menuItems?.length || 0} items
              </p>
            </div>

            {menuData?.data?.menuItems?.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => setFilters({
                    search: '',
                    category: '',
                    dietary: '',
                    priceRange: '',
                    sortBy: 'name',
                    sortOrder: 'asc'
                  })}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuData?.data?.menuItems?.map((item) => (
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
                      {item.isPopular && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Popular
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                        <span className="text-2xl font-bold text-primary-600">
                          ₹{item.price}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                      
                      {/* Dietary Info */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.dietaryInfo.isVegetarian && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Vegetarian
                          </span>
                        )}
                        {item.dietaryInfo.isVegan && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Vegan
                          </span>
                        )}
                        {item.dietaryInfo.isGlutenFree && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Gluten-Free
                          </span>
                        )}
                        {item.dietaryInfo.isSpicy && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Spicy
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Menu
