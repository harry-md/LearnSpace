export const initialChatState = {
  activeChats: [], // Array of chat objects, max 2
};

const ChatReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_CHAT": {
      const chatExists = state.activeChats.find((c) => c.id === action.payload.id);
      if (chatExists) {
        // If already open, just ensure it's not minimized
        return {
          ...state,
          activeChats: state.activeChats.map((c) =>
            c.id === action.payload.id ? { ...c, isMinimized: false } : c
          ),
        };
      }
      
      // Max 2 chats open at the same time
      const newChats = [...state.activeChats];
      if (newChats.length >= 2) {
        newChats.shift(); // Remove the oldest chat
      }
      
      newChats.push({ ...action.payload, isMinimized: false });

      return {
        ...state,
        activeChats: newChats,
      };
    }
    case "CLOSE_CHAT": {
      return {
        ...state,
        activeChats: state.activeChats.filter((c) => c.id !== action.payload),
      };
    }
    case "TOGGLE_MINIMIZE": {
      return {
        ...state,
        activeChats: state.activeChats.map((c) =>
          c.id === action.payload ? { ...c, isMinimized: !c.isMinimized } : c
        ),
      };
    }
    default:
      return state;
  }
};

export default ChatReducer;
