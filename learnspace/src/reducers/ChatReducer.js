export const initialChatState = {
  activeChats: [],
};

const ChatReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_CHAT": {
      const chatExists = state.activeChats.find(
        (c) => c.id === action.payload.id,
      );
      if (chatExists) {
        return {
          ...state,
          activeChats: state.activeChats.map((c) =>
            c.id === action.payload.id ? { ...c, isMinimized: false } : c,
          ),
        };
      }

      const newChats = [...state.activeChats];
      if (newChats.length >= 2) {
        newChats.shift();
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
          c.id === action.payload ? { ...c, isMinimized: !c.isMinimized } : c,
        ),
      };
    }
    default:
      return state;
  }
};

export default ChatReducer;
