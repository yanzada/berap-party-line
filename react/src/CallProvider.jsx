import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
  useRef
} from "react";
import Daily from "@daily-co/daily-js";
import { LISTENER, MOD, SPEAKER } from "./App";


export const CallContext = createContext(null);

export const PREJOIN = "pre-join";
export const INCALL = "in-call";
const MSG_MAKE_MODERATOR = "make-moderator";
const MSG_MAKE_SPEAKER = "make-speaker";
const MSG_MAKE_LISTENER = "make-listener";
const FORCE_EJECT = "force-eject";
const MSG_WOW = "wow";
const MSG_NEW_AUDIO_TRACK = 'new-audio-track';


export const CallProvider = ({ children }) => {
  const [view, setView] = useState(PREJOIN); // pre-join | in-call
  const [callFrame, setCallFrame] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [roomExp, setRoomExp] = useState(null);
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [updateParticipants, setUpdateParticipants] = useState(null);

  
  
  

  const [messageChat, setMessageChat] = useState([]);
  const [newWow, setNewWow] = useState();

  
  const NewMessageChat = useCallback((evt) => {
    return callFrame.sendAppMessage({ msg: evt }, '*');

   

  });

  const UpdateMicUser = useCallback((evt, sessionId, beat) => {

    const test = async () => {
      const stream =  await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      let audioContext = new (window.AudioContext || window.webkitAudioContext)();

     
      let microphone = audioContext.createMediaStreamSource(stream);
  
      
     
      beat.crossOrigin = "anonymous";
      console.log("MEU BEEEEEEEEEEEEEAT", beat);
      let backgroundMusic = audioContext.createMediaElementSource(beat);
      let gainNodeBeat = audioContext.createGain();
      backgroundMusic.connect(gainNodeBeat);
      gainNodeBeat.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNodeBeat.connect(audioContext.destination);
  
      let mixedOutput = audioContext.createMediaStreamDestination();
  
      microphone.connect(mixedOutput);
      gainNodeBeat.connect(mixedOutput);
  
      let streamBeat = mixedOutput.stream;
      streamBeat.crossOrigin = "anonymous";
      //beat.style.display = 'none'; 
     

      let track = streamBeat.getAudioTracks()[0];


  
      callFrame.setInputDevicesAsync({
        videoSource: null,
        audioSource: track,
      });
    }
    
    test();
     callFrame.sendAppMessage({ msg: evt, session: sessionId }, '*');

    updateAudioTrackForAll(sessionId);
    
  });

  const updateAudioTrackForAll = useCallback((sessionId) => {
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$ entrei no UpdateMicUser');

    const teste = async () => {
      const stream =  await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.createMediaStreamSource(stream);
    }
   
    teste();

    return callFrame.updateParticipant(sessionId, {
      setSubscribedTracks: { audio: true, video: true, screenVideo: false },
    });
  });


  const createRoom = async (roomName) => {
    if (roomName) return roomName;
    const response = await fetch(
      // CHANGE THIS TO YOUR NETLIFY URL
      // EX: https://myapp.netlify.app/.netlify/functions/room
      `${
        process.env.REACT_APP_NETLIFY_URL || "https://partyline.daily.co"
      }/.netlify/functions/room`,
      {
        method: "POST",
      }
    ).catch((err) => {
      throw new Error(err);
    });
    const room = await response.json();
    return room;
  };
  const createToken = async (roomName) => {
    if (!roomName) {
      setError("Eep! We could not create a token");
    }
    const response = await fetch(
      // CHANGE THIS TO YOUR NETLIFY URL
      // EX: https://myapp.netlify.app/.netlify/functions/token
      `${
        process.env.REACT_APP_NETLIFY_URL || "https://partyline.daily.co"
      }/.netlify/functions/token`,
      {
        method: "POST",
        body: JSON.stringify({ properties: { room_name: roomName } }),
      }
    ).catch((err) => {
      throw new Error(err);
    });
    const result = await response.json();
    return result;
  };

  const joinRoom = useCallback(
    async ({ userName, name, moderator }) => {
      if (callFrame) {
        callFrame.leave();
      }

      let roomInfo = { name };
      /**
       * The first person to join will need to create the room first
       */
      if (!name && !moderator) {
        roomInfo = await createRoom();
      }
      setRoom(roomInfo);

      /**
       * When a moderator makes someone else a moderator,
       * they first leave and then rejoin with a token.
       * In that case, we create a token for the new mod here.
       */
      let newToken;
      if (moderator) {
        // create a token for new moderators
        newToken = await createToken(name);
      }

      
      // navigator.mediaDevices.getUserMedia(myConstraints)
      // .then((stream) => {
      //   console.log('*******MY STREAM', stream);
      // })
      // .catch((err) => {
      //   console.log('*******ERROR MY STREAM', err);
      // });

     
        // const stream =  await navigator.mediaDevices.getUserMedia({
        //   audio: true,
        // });
  
        // let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
       
        // let microphone = audioContext.createMediaStreamSource(stream);
    
        
        // let beat = audioRef.current;
        // beat.crossOrigin = "anonymous";
        // console.log("MEU BEEEEEEEEEEEEEAT", beat);
        // let backgroundMusic = audioContext.createMediaElementSource(beat);
        // let gainNodeBeat = audioContext.createGain();
        // backgroundMusic.connect(gainNodeBeat);
        // gainNodeBeat.gain.setValueAtTime(0.25, audioContext.currentTime);
        // gainNodeBeat.connect(audioContext.destination);
    
        // let mixedOutput = audioContext.createMediaStreamDestination();
    
        // microphone.connect(mixedOutput);
        // gainNodeBeat.connect(mixedOutput);
    
        // let streamBeat = mixedOutput.stream;
        // streamBeat.crossOrigin = "anonymous";
        // beat.style.display = 'none'; 
       
  
        // let track = streamBeat.getAudioTracks()[0];
      
    

    
      const call = Daily.createCallObject({
        audioSource: false, // start with audio on to get mic permission from user at start
        videoSource: false,
        subscribeToTracksAutomatically: false,
        dailyConfig: {
          experimentalChromeVideoMuteLightOff: true,
        },
      });

    

      const options = {
        // CHANGE THIS TO YOUR DAILY DOMAIN
        // EX: https://myaccount.daily.co/${roomInfo?.name}
        url: `${
          process.env.REACT_APP_DAILY_DOMAIN || "https://devrel.daily.co"
        }/${roomInfo?.name}`,
        userName,
      };
      if (roomInfo?.token) {
        options.token = roomInfo?.token;
      }
      if (newToken?.token) {
        options.token = newToken.token;
      }

      function handleJoinedMeeting(evt) {
        setUpdateParticipants(
          `joined-${evt?.participant?.user_id}-${Date.now()}`
        );
        setView(INCALL);
        console.log("[JOINED MEETING]", evt?.participant);
      }

      call.on("joined-meeting", handleJoinedMeeting);

      await call
        .join(options)
        .then(() => {
          setError(false);
          setCallFrame(call);
          /**
           * Now mute, so everyone joining is muted by default.
           *
           * IMPROVEMENT: track a speaker's muted state so if they
           * are rejoining as a moderator, they don't have to turn
           * their mic back on.
           */
          call.setLocalAudio(false);
        })
        .catch((err) => {
          if (err) {
            setError(err);
          }
        });
      /**
       * IMPROVEMENT: Every room should have a moderator. We should
       * prevent people from joining (or kick them out after joining)
       * if a mod isn't present. Since these demo rooms only last ten
       * minutes we're not currently checking this.
       */

      return () => {
        call.off("joined-meeting", handleJoinedMeeting);
      };
    },

   

    [callFrame]
  );

  const handleParticipantJoinedOrUpdated = useCallback((evt) => {
    setUpdateParticipants(`updated-${evt?.participant?.user_id}-${Date.now()}`);
    console.log("[PARTICIPANT JOINED/UPDATED]", evt.participant);

    
  }, []);

  const handleParticipantLeft = useCallback((evt) => {
    setUpdateParticipants(`left-${evt?.participant?.user_id}-${Date.now()}`);
    console.log("[PARTICIPANT LEFT]", evt);
  }, []);
  const handleActiveSpeakerChange = useCallback((evt) => {
    console.log("[ACTIVE SPEAKER CHANGE]", evt);
    setActiveSpeakerId(evt?.activeSpeaker?.peerId);
  }, []);

  const playTrack = useCallback((evt) => {
    console.log(
      "[TRACK STARTED]",
      evt.participant && evt.participant.session_id
    );
    setUpdateParticipants(
      `track-started-${evt?.participant?.user_id}-${Date.now()}`
    );
  }, []);

  const destroyTrack = useCallback((evt) => {
    console.log("[DESTROY TRACK]", evt);
    setUpdateParticipants(
      `track-stopped-${evt?.participant?.user_id}-${Date.now()}`
    );
  }, []);

  const getAccountType = useCallback((username) => {
    if (!username) return;
    // check last three letters to compare to account type constants
    return username.slice(-3);
  }, []);





  const leaveCall = useCallback(() => {
    if (!callFrame) return;
    async function leave() {
      await callFrame.leave();
    }
    leave();
    setView(PREJOIN);
  }, [callFrame]);

  const removeFromCall = useCallback(
    (participant) => {
      if (!callFrame) return;
      console.log("[EJECTING PARTICIPANT]", participant?.user_id);
      /**
       * When the remote participant receives this message, they'll leave
       * the call on their end.
       */
      callFrame.sendAppMessage({ msg: FORCE_EJECT }, participant?.session_id);
      
      setUpdateParticipants(
        `eject-participant-${participant?.user_id}-${Date.now()}`
      );
    },
    [callFrame]
  );

  const endCall = useCallback(() => {
    console.log("[ENDING CALL]");
    participants.forEach((p) => removeFromCall(p));
    leaveCall();
  }, [participants, removeFromCall, leaveCall]);

  const displayName = useCallback((username) => {
    if (!username) return;
    // return name without account type
    return username.slice(0, username.length - 4);
  }, []);

  const updateUsername = useCallback(
    (newAccountType) => {
      if (![MOD, SPEAKER, LISTENER].includes(newAccountType)) return;
      /**
       * In case the user had their hand raised, let's make
       * sure to remove that emoji before updating the account type.
       */
      const split = callFrame?.participants()?.local?.user_name.split("✋ ");
      const handRemoved = split.length === 2 ? split[1] : split[0];

      const display = displayName(handRemoved);
      /**
       * The display name is what the participant provided on sign up.
       * We append the account type to their user name so to update
       * the account type we can update the last few letters.
       */
      callFrame.setUserName(`${display}_${newAccountType}`);
    },
    [callFrame, displayName]
  );

  const handleMute = useCallback(
    (p) => {
      if (!callFrame) return;
      if (p?.user_id === "local") {
        callFrame.setLocalAudio(false);
      } else {
        callFrame.updateParticipant(p?.session_id, {
          setAudio: false,
        });
      }
      setUpdateParticipants(`unmute-${p?.user_id}-${Date.now()}`);
    },
    [callFrame]
  );
  const handleUnmute = useCallback(
    (p) => {
      if (!callFrame) return;
      console.log("UNMUTING");
      if (p?.user_id === "local") {
        callFrame.setLocalAudio(true);
      } else {
        callFrame.updateParticipant(p?.session_id, {
          setAudio: true,
        });
      }
      setUpdateParticipants(`unmute-${p?.user_id}-${Date.now()}`);
    },
    [callFrame]
  );
  const raiseHand = useCallback(
    (p) => {
      if (!callFrame) return;
      console.log("RAISING HAND");
      callFrame.setUserName(`✋ ${p?.user_name}`);
      setUpdateParticipants(`raising-hand-${p?.user_id}-${Date.now()}`);
    },
    [callFrame]
  );
  const lowerHand = useCallback(
    (p) => {
      if (!callFrame) return;
      console.log("UNRAISING HAND");
      const split = p?.user_name.split("✋ ");
      const username = split.length === 2 ? split[1] : split[0];
      callFrame.setUserName(username);
      setUpdateParticipants(`unraising-hand-${p?.user_id}-${Date.now()}`);
    },
    [callFrame]
  );

  const changeAccountType = useCallback(
    (participant, accountType) => {
      if (!participant || ![MOD, SPEAKER, LISTENER].includes(accountType))
        return;
      /**
       * In case someone snuck in through a direct link, give their username
       * the correct formatting
       */
      let userName;
      if (
        ![MOD, SPEAKER, LISTENER].includes(
          getAccountType(participant?.user_name)
        )
      ) {
        userName = participant?.user_name + `_${accountType}`;
      }
      userName = displayName(participant?.user_name) + `_${accountType}`;
      /**
       * Direct message the participant their account type has changed.
       * The participant will then update their own username with setUserName().
       * setUserName will trigger a participant updated event for everyone
       * to then update the participant list in their local state.
       */
      const msg =
        accountType === MOD
          ? MSG_MAKE_MODERATOR
          : accountType === SPEAKER
          ? MSG_MAKE_SPEAKER
          : MSG_MAKE_LISTENER;

      console.log("[UPDATING PARTICIPANT]");
      if (msg === MSG_MAKE_LISTENER) {
        handleMute(participant);
      }
      callFrame.sendAppMessage(
        { userName, id: participant?.user_id, msg },
        participant?.session_id
      );

      
    },
    [getAccountType, displayName, handleMute, callFrame]
  );

  useEffect(() => {
    if (!callFrame) return;

    const handleAppMessage = async (evt) => {
      console.log("[APP MESSAGE]", evt);
      try {
        switch (evt?.data?.msg) {
          case MSG_MAKE_MODERATOR:
            console.log("[LEAVING]");
            await callFrame.leave();
            let userName = evt?.data?.userName;
            if (userName?.includes("✋")) {
              const split = userName.split("✋ ");
              userName = split.length === 2 ? split[1] : split[0];
            }
            joinRoom({
              moderator: true,
              userName,
              name: room?.name,
            });
            break;
          case MSG_MAKE_SPEAKER:
            updateUsername(SPEAKER);
            break;
          case MSG_MAKE_LISTENER:
            updateUsername(LISTENER);
            break;
          case FORCE_EJECT:
            //seeya
            leaveCall();
            break;
            case MSG_WOW:
              console.log('cai no WOW?');
              let wow = 'wow'+ Math.random();
              setNewWow(wow);
            break;  
            case MSG_NEW_AUDIO_TRACK:
              console.log('cai no NEW AUDIO TRACK?');
              updateAudioTrackForAll(evt.data.session);
            break;  
          default:
            console.log('cai aqui?');
            setMessageChat(evt.data.msg);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    };

    const showError = (e) => {
      console.log("[ERROR]");
      console.warn(e);
    };

    console.log(callFrame?.meetingState());
    callFrame.on("error", showError);
    callFrame.on("participant-joined", handleParticipantJoinedOrUpdated);
    callFrame.on("participant-updated", handleParticipantJoinedOrUpdated);
    callFrame.on("participant-left", handleParticipantLeft);
    callFrame.on("app-message", handleAppMessage);
    callFrame.on("active-speaker-change", handleActiveSpeakerChange);
    callFrame.on("track-started", playTrack);
    callFrame.on("track-stopped", destroyTrack);

    return () => {
      // clean up
      callFrame.off("error", showError);
      callFrame.off("participant-joined", handleParticipantJoinedOrUpdated);
      callFrame.off("participant-updated", handleParticipantJoinedOrUpdated);
      callFrame.off("participant-left", handleParticipantLeft);
      callFrame.off("app-message", handleAppMessage);
      callFrame.off("active-speaker-change", handleActiveSpeakerChange);
      callFrame.off("track-started", playTrack);
      callFrame.off("track-stopped", destroyTrack);
    };
  }, [
    callFrame,
    joinRoom,
    leaveCall,
    room?.name,
    updateUsername,
    handleParticipantJoinedOrUpdated,
    handleActiveSpeakerChange,
    handleParticipantLeft,
    playTrack,
    destroyTrack,
  ]);

  /**
   * Update participants for any event that happens
   * to keep the local participants list up to date.
   * We grab the whole participant list to make sure everyone's
   * status is the most up-to-date.
   */
  useEffect(() => {
    if (updateParticipants) {
      console.log("[UPDATING PARTICIPANT LIST]");
      const list = Object.values(callFrame?.participants() || {});
      setParticipants(list);
    }
  }, [updateParticipants, callFrame]);

  useEffect(() => {
    if (!callFrame) return;
    async function getRoom() {
      console.log("[GETTING ROOM DETAILS]");
      const room = await callFrame?.room();
      const exp = room?.config?.exp;
      setRoom(room);
      if (exp) {
        setRoomExp(exp * 2000 || Date.now() + 1 * 60 * 1000);
      }
    }
    getRoom();
  }, [callFrame]);

  return (
    <CallContext.Provider
      value={{
        getAccountType,
        changeAccountType,
        handleMute,
        handleUnmute,
        displayName,
        joinRoom,
        leaveCall,
        endCall,
        removeFromCall,
        raiseHand,
        lowerHand,
        setMessageChat,
        setNewWow,
        UpdateMicUser,
        messageChat,
        NewMessageChat,
        activeSpeakerId,
        error,
        participants,
        room,
        roomExp,
        view,
        newWow,
      }}
    >
      {children}

      
    </CallContext.Provider>
  );
};
export const useCallState = () => useContext(CallContext);
