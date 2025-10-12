import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  property_id: string | null
  content: string
  read: boolean
  created_at: string
}

interface Conversation {
  userId: string
  userName: string
  userAvatar: string | null
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

interface MessagesState {
  messages: Message[]
  conversations: Conversation[]
  selectedConversation: string | null
  loading: boolean
  error: string | null
  unreadCount: number
}

const initialState: MessagesState = {
  messages: [],
  conversations: [],
  selectedConversation: null,
  loading: false,
  error: null,
  unreadCount: 0,
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
      state.unreadCount = action.payload.filter(m => !m.read).length
      state.loading = false
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
      if (!action.payload.read) {
        state.unreadCount += 1
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const message = state.messages.find(m => m.id === action.payload)
      if (message && !message.read) {
        message.read = true
        state.unreadCount -= 1
      }
    },
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      state.messages
        .filter(m => (m.sender_id === action.payload || m.receiver_id === action.payload) && !m.read)
        .forEach(m => {
          m.read = true
          state.unreadCount -= 1
        })
    },
    setSelectedConversation: (state, action: PayloadAction<string | null>) => {
      state.selectedConversation = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setMessages,
  setConversations,
  addMessage,
  markAsRead,
  markConversationAsRead,
  setSelectedConversation,
  setLoading,
  setError,
} = messagesSlice.actions

export default messagesSlice.reducer
