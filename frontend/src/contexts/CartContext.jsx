import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item.menuItem._id === action.payload.menuItem._id &&
        JSON.stringify(item.customization) === JSON.stringify(action.payload.customization)
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item === existingItem
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        }
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }

    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload
      }

    case 'CALCULATE_TOTAL':
      const total = state.items.reduce((sum, item) => {
        const basePrice = item.menuItem.price
        const customizationPrice = item.customization.reduce((customSum, custom) => {
          return customSum + custom.selectedChoices.reduce((choiceSum, choice) => {
            return choiceSum + (choice.price || 0)
          }, 0)
        }, 0)
        return sum + (basePrice + customizationPrice) * item.quantity
      }, 0)

      const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        total,
        itemCount
      }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Calculate total whenever items change
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTAL' })
  }, [state.items])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        cartData.items.forEach(item => {
          dispatch({ type: 'ADD_ITEM', payload: item })
        })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      total: state.total,
      itemCount: state.itemCount
    }))
  }, [state.items, state.total, state.itemCount])

  const addItem = (menuItem, quantity = 1, customization = []) => {
    const item = {
      id: Date.now() + Math.random(),
      menuItem,
      quantity,
      customization,
      specialInstructions: ''
    }
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    localStorage.removeItem('cart')
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const setCartOpen = (isOpen) => {
    dispatch({ type: 'SET_CART_OPEN', payload: isOpen })
  }

  const getItemCount = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotal = () => {
    return state.items.reduce((sum, item) => {
      const basePrice = item.menuItem.price
      const customizationPrice = item.customization.reduce((customSum, custom) => {
        return customSum + custom.selectedChoices.reduce((choiceSum, choice) => {
          return choiceSum + (choice.price || 0)
        }, 0)
      }, 0)
      return sum + (basePrice + customizationPrice) * item.quantity
    }, 0)
  }

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    getItemCount,
    getTotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
