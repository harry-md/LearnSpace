export const initialUIState = {
  loading: false,
  compareMode: false,
  dialog: {
    show: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  },
};

const UIReducer = (state, action) => {
  switch (action.type) {
    case "COMPARE_COURSE_MODE":
      return {
        ...state,
        compareMode: action.payload,
      };
    case "SHOW_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "HIDE_LOADING":
      return {
        ...state,
        loading: false,
      };
    case "SHOW_DIALOG":
      return {
        ...state,
        dialog: {
          show: true,
          title: action.payload.title || "",
          message: action.payload.message || "",
          type: action.payload.type || "info",
          onConfirm: action.payload.onConfirm || null,
        },
      };
    case "HIDE_DIALOG":
      return {
        ...state,
        dialog: {
          ...state.dialog,
          show: false,
        },
      };
    default:
      return state;
  }
};

export default UIReducer;
