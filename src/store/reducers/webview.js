// Define initial state
const initialState = {
  isCallViewOn: false,
  consulteaseUserProfileData: {},
  calleeDetails: {},
  // calleeRingtone: null,
  callerDetails: {
    name: undefined,
    callCategory: undefined,
    photo: undefined,
  },
  socket: {
    id: null,
  },
  calleeSocketId: undefined,
  peerSocketID: undefined,
  agoraChannel: undefined,
  callID: undefined,
  callInstanceData: undefined,
  proceedToJoinCall: false,
  incomingCallDetails: undefined,
  outgoingCallDetails: undefined,
  isInternetConnected: undefined,
  ongoingCallStatus: false,
};

// Define reducer function
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CALL_VIEW_ON':
      return {
        ...state,
        isCallViewOn: action.payload,
      };

    case 'SET_CALLEE_DETAILS':
      return {
        ...state,
        calleeDetails: action.payload,
      };

    // case 'SET_CALLEE_RINGTONE':
    //   return {
    //     ...state,
    //     calleeRingtone: action.payload,
    //   }

    case 'SET_CALLER_DETAILS':
      return {
        ...state,
        callerDetails: action.payload,
      };
    case 'SET_CALLEE_SOCKET_ID':
      return {
        ...state,
        calleeSocketId: action.payload,
      };

    case 'SET_SOCKET_ID':
      return {
        ...state,
        socket: {
          id: action.payload,
        },
      };

    case 'SET_PEER_SOCKET_ID':
      return {
        ...state,
        peerSocketId: action.payload,
      };

    case 'SET_CONSULTEASE_USER_PROFILE_DATA':
      return {
        ...state,
        consulteaseUserProfileData: action.payload,
      };

    case 'RESET_WEBVIEW_DERIVED_DATA':
      return state;

    case 'SET_CALL_ID':
      return {
        ...state,
        callID: action.payload,
      }

    case 'SET_AGORA_CHANNEL':
      return {
        ...state,
        agoraChannel: action.payload,
      }

    case 'SET_CALL_INSTANCE_DATA':
      return {
        ...state,
        callInstanceData: action.payload,
      };

    case 'SET_OUTGOING_CALL_DETAILS':
      return {
        ...state,
        outgoingCallDetails: action.payload,
      };

    case 'SET_INCOMING_CALL_DETAILS':
      return {
        ...state,
        incomingCallDetails: action.payload,
      };

    case 'SET_ONGOING_CALL_STATUS':
      return {
        ...state,
        ongoingCallStatus: action.payload,
      };

    case 'SET_INTERNET_CONNECTION':
      return {
        ...state,
        isInternetConnected: action.payload,
      };

    case 'PROCEED_TO_JOIN_CALL':
      return {
        ...state,
        proceedToJoinCall: action.payload,
      };

    default:
      return state;
  }
}

export default reducer;
