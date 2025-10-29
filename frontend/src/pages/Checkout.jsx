import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useMutation } from 'react-query'
import { ordersAPI, paymentsAPI } from '../services/api'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  CreditCardIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const Checkout = () => {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState('dine-in')
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    instructions: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)

  const createOrderMutation = useMutation(
    (orderData) => ordersAPI.createOrder(orderData),
    {
      onSuccess: (response) => {
        toast.success('Order placed successfully!')
        clearCart()
        navigate('/orders')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to place order')
        setIsProcessing(false)
      }
    }
  )

  const createPaymentMutation = useMutation(
    ({ orderId, amount }) => paymentsAPI.createPaymentIntent(orderId, amount),
    {
      onSuccess: (response) => {
        // Handle Stripe payment
        handleStripePayment(response.data.clientSecret)
      },
      onError: (error) => {
        toast.error('Payment initialization failed')
        setIsProcessing(false)
      }
    }
  )

  const handleStripePayment = async (clientSecret) => {
    // This would integrate with Stripe Elements
    // For now, we'll simulate a successful payment
    setTimeout(() => {
      toast.success('Payment successful!')
      setIsProcessing(false)
    }, 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Create order data
      const orderData = {
        items: items.map(item => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
          customization: item.customization || [],
          specialInstructions: item.specialInstructions || ''
        })),
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        notes: '',
        paymentMethod: paymentMethod
      }

      // For cash payments, create order directly
      await createOrderMutation.mutateAsync(orderData)
      
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error?.response?.data?.message || 'Failed to place order')
      setIsProcessing(false)
    }
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/discounts/validate',
        { code: promoCode, orderTotal: total },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      if (response.data.valid) {
        setAppliedDiscount(response.data.discount)
        toast.success('Promo code applied successfully!')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid promo code')
    }
  }

  const subtotal = total
  const discount = appliedDiscount ? appliedDiscount.discountAmount : 0
  const priceAfterDiscount = subtotal - discount
  const tax = priceAfterDiscount * 0.18
  const deliveryFee = orderType === 'delivery' ? 50 : 0
  const finalTotal = priceAfterDiscount + tax + deliveryFee

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
          <button
            onClick={() => navigate('/menu')}
            className="btn-primary"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="orderType"
                    value="dine-in"
                    checked={orderType === 'dine-in'}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    orderType === 'dine-in' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ClockIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Dine In</h3>
                      <p className="text-sm text-gray-500">Eat at our restaurant</p>
                    </div>
                  </div>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="orderType"
                    value="takeaway"
                    checked={orderType === 'takeaway'}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    orderType === 'takeaway' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Takeaway</h3>
                      <p className="text-sm text-gray-500">Pick up your order</p>
                    </div>
                  </div>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={orderType === 'delivery'}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    orderType === 'delivery' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <MapPinIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Delivery</h3>
                      <p className="text-sm text-gray-500">Delivered to your door</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                      className="input-field"
                      placeholder="Enter street address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="input-field"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.state}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="input-field"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.zipCode}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="input-field"
                        placeholder="ZIP Code"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={deliveryAddress.phone}
                      onChange={(e) => setDeliveryAddress(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      value={deliveryAddress.instructions}
                      onChange={(e) => setDeliveryAddress(prev => ({ ...prev, instructions: e.target.value }))}
                      className="input-field"
                      rows={3}
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg border-primary-500 bg-primary-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Cash on Delivery</div>
                    <div className="text-xs text-gray-500">Pay when you receive your order</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Credit/Debit Card</div>
                      <div className="text-xs text-gray-500">Secure payment via Stripe</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.menuItem.images?.[0]?.url || '/api/placeholder/50/50'}
                      alt={item.menuItem.name}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.menuItem.name}
                      </h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{((item.menuItem.price + item.customization.reduce((sum, custom) => 
                        sum + custom.selectedChoices.reduce((choiceSum, choice) => 
                          choiceSum + (choice.price || 0), 0), 0
                      )) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 input-field text-sm"
                    disabled={!!appliedDiscount}
                  />
                  {!appliedDiscount ? (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPromoCode('')
                        setAppliedDiscount(null)
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {appliedDiscount && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {appliedDiscount.code} applied - ₹{appliedDiscount.discountAmount.toFixed(2)} off
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary text-lg py-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Place Order - ₹${finalTotal.toFixed(2)}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
