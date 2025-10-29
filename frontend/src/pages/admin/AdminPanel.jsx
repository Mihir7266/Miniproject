import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { menuAPI, adminAPI, ordersAPI, reservationsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  UsersIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('menu')
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState(null)
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main-course',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    imageUrl: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const queryClient = useQueryClient()

  // Menu Queries
  const { data: menuData, isLoading: menuLoading } = useQuery(
    'admin-menu-all',
    () => menuAPI.getMenu({ limit: 100 })
  )

  // Orders Query
  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    'admin-orders-all',
    () => ordersAPI.getAllOrders()
  )

  // Reservations Query  
  const { data: reservationsData, isLoading: reservationsLoading } = useQuery(
    'admin-reservations-all',
    () => reservationsAPI.getAllReservations()
  )

  // Mutations
  const createMenuItemMutation = useMutation(
    (data) => menuAPI.createMenuItem(data),
    {
      onSuccess: () => {
        toast.success('Menu item created successfully')
        setIsMenuModalOpen(false)
        resetMenuForm()
        queryClient.invalidateQueries('admin-menu-all')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create menu item')
      }
    }
  )

  const updateMenuItemMutation = useMutation(
    ({ id, data }) => menuAPI.updateMenuItem(id, data),
    {
      onSuccess: () => {
        toast.success('Menu item updated successfully')
        setIsMenuModalOpen(false)
        resetMenuForm()
        queryClient.invalidateQueries('admin-menu-all')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update menu item')
      }
    }
  )

  const deleteMenuItemMutation = useMutation(
    (id) => menuAPI.deleteMenuItem(id),
    {
      onSuccess: () => {
        toast.success('Menu item deleted successfully')
        queryClient.invalidateQueries('admin-menu-all')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete menu item')
      }
    }
  )

  const resetMenuForm = () => {
    setMenuFormData({
      name: '',
      description: '',
      price: '',
      category: 'main-course',
      isAvailable: true,
      isPopular: false,
      isFeatured: false,
      imageUrl: ''
    })
    setEditingMenuItem(null)
    setImageFile(null)
    setImagePreview('')
  }

  const handleAddMenuItem = () => {
    setEditingMenuItem(null)
    resetMenuForm()
    setIsMenuModalOpen(true)
  }

  const handleEditMenuItem = (item) => {
    setEditingMenuItem(item)
    setMenuFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isAvailable: item.availability?.isAvailable ?? true,
      isPopular: item.isPopular,
      isFeatured: item.isFeatured,
      imageUrl: item.images?.[0]?.url || ''
    })
    setImagePreview(item.images?.[0]?.url || '')
    setImageFile(null)
    setIsMenuModalOpen(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteMenuItem = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMenuItemMutation.mutate(id)
    }
  }

  const handleMenuSubmit = (e) => {
    e.preventDefault()
    
    // Handle image upload
    let imageUrl = menuFormData.imageUrl
    if (imageFile) {
      // Use the selected image preview (data URL) so each item keeps its own image
      imageUrl = imagePreview || imageUrl
    }
    
    const data = {
      ...menuFormData,
      price: parseFloat(menuFormData.price),
      images: imageUrl ? [{ url: imageUrl, alt: menuFormData.name, isPrimary: true }] : [],
      availability: {
        isAvailable: menuFormData.isAvailable
      }
    }

    if (editingMenuItem) {
      updateMenuItemMutation.mutate({ id: editingMenuItem._id, data })
    } else {
      createMenuItemMutation.mutate(data)
    }
  }

  const tabs = [
    { id: 'menu', name: 'Menu Items', icon: ClipboardDocumentListIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'reservations', name: 'Reservations', icon: CalendarDaysIcon },
    { id: 'users', name: 'Users', icon: UsersIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage your restaurant</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors duration-200
                      ${activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'menu' && (
            <MenuManagement 
              menuData={menuData}
              loading={menuLoading}
              onAdd={handleAddMenuItem}
              onEdit={handleEditMenuItem}
              onDelete={handleDeleteMenuItem}
            />
          )}
          {activeTab === 'orders' && (
            <OrdersManagement 
              ordersData={ordersData}
              loading={ordersLoading}
            />
          )}
          {activeTab === 'reservations' && (
            <ReservationsManagement 
              reservationsData={reservationsData}
              loading={reservationsLoading}
            />
          )}
          {activeTab === 'users' && (
            <UsersManagement />
          )}
        </div>

        {/* Add/Edit Menu Item Modal */}
        {isMenuModalOpen && (
          <MenuModal
            isOpen={isMenuModalOpen}
            onClose={() => {
              setIsMenuModalOpen(false)
              resetMenuForm()
            }}
            formData={menuFormData}
            setFormData={setMenuFormData}
            onSubmit={handleMenuSubmit}
            isEditing={!!editingMenuItem}
            loading={createMenuItemMutation.isLoading || updateMenuItemMutation.isLoading}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
          />
        )}
      </div>
    </div>
  )
}

const MenuManagement = ({ menuData, loading, onAdd, onEdit, onDelete }) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
      <button
        onClick={onAdd}
        className="btn-primary flex items-center space-x-2"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Add Menu Item</span>
      </button>
    </div>

    {loading ? (
      <div className="p-12 text-center">
        <div className="spinner mx-auto"></div>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuData?.data?.menuItems?.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={item.images?.[0]?.url || '/api/placeholder/50/50'}
                      alt={item.name}
                      className="h-12 w-12 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{item.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.availability.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.availability.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item._id, item.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {menuData?.data?.menuItems?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No menu items found</p>
          </div>
        )}
      </div>
    )}
  </div>
)

const OrdersManagement = ({ ordersData, loading }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>
    {loading ? (
      <div className="p-12 text-center">
        <div className="spinner mx-auto"></div>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordersData?.data?.orders?.slice(0, 10).map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customer?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{order.total?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

const ReservationsManagement = ({ reservationsData, loading }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservations</h2>
    {loading ? (
      <div className="p-12 text-center">
        <div className="spinner mx-auto"></div>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservationsData?.data?.reservations?.slice(0, 10).map((reservation) => (
              <tr key={reservation._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(reservation.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reservation.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.partySize} people
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reservation.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reservation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

const UsersManagement = () => {
  const { data: usersData, isLoading } = useQuery(
    'admin-users',
    () => adminAPI.getUsers({ limit: 50 })
  )

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Users</h2>
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="spinner mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData?.data?.users?.slice(0, 10).map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const MenuModal = ({ isOpen, onClose, formData, setFormData, onSubmit, isEditing, loading, imagePreview, onImageChange }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Edit Menu Item' : 'Add Menu Item'}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Image
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image or enter a URL below
                </p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Or enter image URL (optional)"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full mt-2 input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full input-field"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full input-field"
                required
              >
                <option value="appetizers">Appetizers</option>
                <option value="main-course">Main Course</option>
                <option value="desserts">Desserts</option>
                <option value="beverages">Beverages</option>
                <option value="salads">Salads</option>
                <option value="soups">Soups</option>
                <option value="specials">Specials</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Available</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Popular</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Add'} Menu Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminPanel

