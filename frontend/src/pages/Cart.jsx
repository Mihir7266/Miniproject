import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { 
  MinusIcon, 
  PlusIcon, 
  TrashIcon,
  ShoppingBagIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsLoading(true)
    // Navigate to checkout page
    window.location.href = '/checkout'
  }

  const handlePrintBill = () => {
    const printWindow = window.open('', '_blank')
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Garden Grains - Bill</title>
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
            .items {
              margin: 20px 0;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
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
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🌱 Garden Grains</div>
            <div>Fresh • Healthy • Delicious</div>
            <div style="margin-top: 10px;">${new Date().toLocaleString()}</div>
          </div>
          
          <div class="items">
            ${items.map((item, index) => `
              <div class="item-row">
                <div>
                  <strong>${item.menuItem.name}</strong>
                  ${item.customization && item.customization.length > 0 ? `
                    <div style="font-size: 12px; color: #666;">
                      ${item.customization.map(custom => 
                        `${custom.optionName}: ${custom.selectedChoices.map(c => c.name).join(', ')}`
                      ).join('<br>')}
                    </div>
                  ` : ''}
                  <span style="font-size: 12px; color: #666;">x ${item.quantity}</span>
                </div>
                <div><strong>₹${((item.menuItem.price + (item.customization?.reduce((sum, custom) => 
                  sum + custom.selectedChoices.reduce((choiceSum, choice) => 
                    choiceSum + (choice.price || 0), 0), 0) || 0)) * item.quantity).toFixed(2)}</strong></div>
              </div>
            `).join('')}
          </div>
          
          <div class="total">
            <div class="item-row">
              <span>Subtotal (${itemCount} items)</span>
              <span>₹${total.toFixed(2)}</span>
            </div>
            <div class="item-row">
              <span>Tax (18%)</span>
              <span>₹${(total * 0.18).toFixed(2)}</span>
            </div>
            <div class="item-row">
              <span>Delivery Fee</span>
              <span>₹50.00</span>
            </div>
            <div class="total-row">
              <span>Total</span>
              <span>₹${(total + total * 0.18 + 50).toFixed(2)}</span>
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

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBagIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <Link
            to="/menu"
            className="btn-primary"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600">{itemCount} item(s) in your cart</p>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Item Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.menuItem.images?.[0]?.url || '/api/placeholder/100/100'}
                          alt={item.menuItem.name}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.menuItem.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.menuItem.description}
                        </p>
                        
                        {/* Customizations */}
                        {item.customization && item.customization.length > 0 && (
                          <div className="mt-2">
                            {item.customization.map((custom, index) => (
                              <div key={index} className="text-sm text-gray-500">
                                <span className="font-medium">{custom.optionName}:</span>
                                {custom.selectedChoices.map((choice, choiceIndex) => (
                                  <span key={choiceIndex} className="ml-1">
                                    {choice.name}
                                    {choice.price > 0 && ` (+₹${choice.price})`}
                                    {choiceIndex < custom.selectedChoices.length - 1 && ', '}
                                  </span>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Special Instructions */}
                        {item.specialInstructions && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">
                              <span className="font-medium">Special Instructions:</span> {item.specialInstructions}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                          <MinusIcon className="h-5 w-5 text-gray-500" />
                        </button>
                        <span className="text-lg font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                          <PlusIcon className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{((item.menuItem.price + item.customization.reduce((sum, custom) => 
                            sum + custom.selectedChoices.reduce((choiceSum, choice) => 
                              choiceSum + (choice.price || 0), 0), 0
                          )) * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₹{((item.menuItem.price + item.customization.reduce((sum, custom) => 
                            sum + custom.selectedChoices.reduce((choiceSum, choice) => 
                              choiceSum + (choice.price || 0), 0), 0
                          ))).toFixed(2)} each
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">₹{(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">₹50.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{(total + total * 0.18 + 50).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <button
                onClick={handlePrintBill}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                <PrinterIcon className="h-5 w-5" />
                Print Bill
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/menu"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
