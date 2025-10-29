import { useState } from 'react'
import { useQuery } from 'react-query'
import { ordersAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  StarIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

const Orders = () => {
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState('')

  const { data: ordersData, isLoading, refetch } = useQuery(
    ['user-orders', selectedStatus],
    () => ordersAPI.getOrders({ status: selectedStatus }),
    {
      enabled: !!user
    }
  )

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
      case 'preparing':
        return <ClockIcon className="h-5 w-5 text-purple-500" />
      case 'ready':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'served':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'preparing':
        return 'bg-purple-100 text-purple-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'served':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Order Placed'
      case 'confirmed':
        return 'Order Confirmed'
      case 'preparing':
        return 'Being Prepared'
      case 'ready':
        return 'Ready for Pickup'
      case 'served':
        return 'Order Served'
      case 'cancelled':
        return 'Order Cancelled'
      default:
        return status
    }
  }

  const handlePrintBill = (order) => {
    const printWindow = window.open('', '_blank')
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Garden Grains - Bill #${order.orderNumber}</title>
          <style>
            @media print {
              @page { margin: 20mm; }
            }
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #d4af37;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #2c5530;
              margin-bottom: 10px;
            }
            .order-info {
              margin: 20px 0;
              padding: 15px;
              background: #f9f9f9;
              border-radius: 8px;
            }
            .items {
              margin: 20px 0;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .item-name {
              flex: 1;
            }
            .item-qty {
              margin-left: 10px;
              color: #666;
              font-size: 12px;
            }
            .total {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #333;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 18px;
              font-weight: bold;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              color: #666;
              font-size: 14px;
            }
            .status {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🌱 Garden Grains</div>
            <div>Fresh • Healthy • Delicious</div>
          </div>
          
          <div class="order-info">
            <p><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>
            <p><strong>Payment Method:</strong> Cash on Delivery</p>
            <span class="status" style="background: ${order.status === 'served' ? '#10b981' : '#f59e0b'}; color: white;">
              ${getStatusText(order.status)}
            </span>
          </div>
          
          <div class="items">
            ${order.items.map((item) => `
              <div class="item-row">
                <div class="item-name">
                  <strong>${item.menuItem?.name || 'Item'}</strong>
                  <span class="item-qty">x ${item.quantity}</span>
                  ${item.customization && item.customization.length > 0 ? `
                    <div style="font-size: 11px; color: #666; margin-top: 2px;">
                      ${item.customization.map(custom => 
                        `${custom.optionName}: ${custom.selectedChoices.map(c => c.name).join(', ')}`
                      ).join(', ')}
                    </div>
                  ` : ''}
                </div>
                <div><strong>₹${item.price * item.quantity}</strong></div>
              </div>
            `).join('')}
          </div>
          
          <div class="total">
            <div class="item-row">
              <span>Subtotal</span>
              <span>₹${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
            </div>
            ${order.tax ? `
            <div class="item-row">
              <span>Tax (18%)</span>
              <span>₹${order.tax.toFixed(2)}</span>
            </div>
            ` : ''}
            ${order.deliveryFee ? `
            <div class="item-row">
              <span>Delivery Fee</span>
              <span>₹${order.deliveryFee.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="total-row">
              <span>Total</span>
              <span>₹${order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Garden Grains!</p>
            <p>123 Green Street, Garden City, GC 12345</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </body>
      </html>
    `
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track your orders and view order history</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="served">Served</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        {ordersData?.data?.orders?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus ? 'No orders with this status.' : "You haven't placed any orders yet."}
            </p>
            <a
              href="/menu"
              className="btn-primary"
            >
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {ordersData?.data?.orders?.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        ₹{order.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} item(s)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.menuItem?.images?.[0]?.url || '/api/placeholder/60/60'}
                          alt={item.menuItem?.name || 'Item'}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.menuItem?.name || 'Item'}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          {item.customization && item.customization.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {item.customization.map((custom, customIndex) => (
                                <span key={customIndex}>
                                  {custom.optionName}: {custom.selectedChoices.map(choice => choice.name).join(', ')}
                                  {customIndex < item.customization.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {
                              (() => {
                                const basePrice = item.price || 0
                                const customizationTotal = (item.customization || []).reduce((sum, custom) => {
                                  const choices = custom?.selectedChoices || []
                                  return sum + choices.reduce((choiceSum, choice) => choiceSum + (choice?.price || 0), 0)
                                }, 0)
                                const total = (basePrice + customizationTotal) * (item.quantity || 0)
                                return `₹${total.toFixed(2)}`
                              })()
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        Order Type: <span className="font-medium capitalize">{order.orderType}</span>
                      </span>
                      {order.estimatedTime && (
                        <span className="text-sm text-gray-600">
                          Est. Time: <span className="font-medium">{order.estimatedTime} mins</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handlePrintBill(order)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm px-3 py-1.5 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        <PrinterIcon className="h-4 w-4" />
                        <span>Print Bill</span>
                      </button>
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        <EyeIcon className="h-4 w-4 mr-1 inline" />
                        View Details
                      </button>
                      {order.status === 'served' && !order.feedback && (
                        <button className="text-secondary-600 hover:text-secondary-700 font-medium text-sm">
                          <StarIcon className="h-4 w-4 mr-1 inline" />
                          Rate Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {ordersData?.data?.pagination && ordersData.data.pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
