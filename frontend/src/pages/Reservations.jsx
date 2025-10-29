import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { reservationsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const Reservations = () => {
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    partySize: 2,
    tablePreference: 'any',
    specialRequests: '',
    occasion: 'other'
  })
  const queryClient = useQueryClient()

  const { data: reservationsData, isLoading } = useQuery(
    'user-reservations',
    () => reservationsAPI.getReservations(),
    {
      enabled: !!user
    }
  )

  const createReservationMutation = useMutation(
    (reservationData) => reservationsAPI.createReservation(reservationData),
    {
      onSuccess: (response) => {
        toast.success('Reservation created successfully!')
        setIsCreating(false)
        setFormData({
          date: '',
          time: '',
          partySize: 2,
          tablePreference: 'any',
          specialRequests: '',
          occasion: 'other'
        })
        queryClient.invalidateQueries('user-reservations')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create reservation')
      }
    }
  )

  const cancelReservationMutation = useMutation(
    (reservationId) => reservationsAPI.cancelReservation(reservationId),
    {
      onSuccess: () => {
        toast.success('Reservation cancelled successfully')
        queryClient.invalidateQueries('user-reservations')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to cancel reservation')
      }
    }
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.date || !formData.time) {
      toast.error('Please select date and time')
      return
    }

    const reservationData = {
      ...formData,
      customerName: user.name,
      customerPhone: user.phone,
      customerEmail: user.email
    }

    createReservationMutation.mutate(reservationData)
  }

  const handleCancel = (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      cancelReservationMutation.mutate(reservationId)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'seated':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'no-show':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ]

  const occasions = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'business', label: 'Business Meeting' },
    { value: 'date', label: 'Date Night' },
    { value: 'family', label: 'Family Gathering' },
    { value: 'other', label: 'Other' }
  ]

  const tablePreferences = [
    { value: 'any', label: 'Any Table' },
    { value: 'window', label: 'Window Seat' },
    { value: 'corner', label: 'Corner Table' },
    { value: 'private', label: 'Private Booth' },
    { value: 'outdoor', label: 'Outdoor Seating' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Table Reservations</h1>
          <p className="text-gray-600">Book a table at Garden Grains Restaurant</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reservation Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Make a Reservation</h2>
                <button
                  onClick={() => setIsCreating(!isCreating)}
                  className="btn-primary"
                >
                  {isCreating ? 'Cancel' : 'New Reservation'}
                </button>
              </div>

              {isCreating && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Party Size
                      </label>
                      <select
                        name="partySize"
                        value={formData.partySize}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        {[...Array(20)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'person' : 'people'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Table Preference
                      </label>
                      <select
                        name="tablePreference"
                        value={formData.tablePreference}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        {tablePreferences.map(pref => (
                          <option key={pref.value} value={pref.value}>{pref.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <select
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {occasions.map(occasion => (
                        <option key={occasion.value} value={occasion.value}>{occasion.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field"
                      placeholder="Any special dietary requirements, accessibility needs, or other requests..."
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createReservationMutation.isLoading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createReservationMutation.isLoading ? 'Creating...' : 'Make Reservation'}
                    </button>
                  </div>
                </form>
              )}

              {!isCreating && (
                <div className="text-center py-8">
                  <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to make a reservation?</h3>
                  <p className="text-gray-600 mb-4">Click the button above to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Reservation History */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Reservations</h3>
              
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner mx-auto"></div>
                </div>
              ) : reservationsData?.data?.reservations?.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDaysIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No reservations yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservationsData?.data?.reservations?.slice(0, 5).map((reservation) => (
                    <div key={reservation._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          #{reservation.confirmationCode}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 mr-2" />
                          {new Date(reservation.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          {reservation.time}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          {reservation.partySize} people
                        </div>
                        {reservation.tablePreference !== 'any' && (
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {reservation.tablePreference}
                          </div>
                        )}
                      </div>
                      {reservation.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(reservation._id)}
                          className="mt-2 text-sm text-red-600 hover:text-red-700"
                        >
                          Cancel Reservation
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservations
