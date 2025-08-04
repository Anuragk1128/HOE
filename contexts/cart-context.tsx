"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  images?: string[] // Array of all product images
  category: string
  subcategory: string
  brand: string
  gender: string
  description?: string
  details?: string
  jewelleryAttributes?: {
    metalType?: string;
    purity?: string;
    stoneType?: string;
    stoneQuality?: string;
    weight?: number;
    designStyle?: string;
  };
  sportswearAttributes?: {
    material?: string;
    fitType?: string;
    activityType?: string;
  };
}

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean }
  | { type: "LOAD_CART"; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
          isOpen: true,
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        isOpen: true,
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "SET_CART_OPEN":
      return {
        ...state,
        isOpen: action.payload,
      }

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
      }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (open: boolean) => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: parsedCart })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const setCartOpen = (open: boolean) => {
    dispatch({ type: "SET_CART_OPEN", payload: open })
  }

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
