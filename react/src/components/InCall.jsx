import { useMemo, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import { INCALL, useCallState } from "../CallProvider";
import { SPEAKER, LISTENER, MOD } from "../App";
import Participant from "./Participant";
import Audio from "./Audio";
import Counter from "./Counter";
import MicIcon from "./MicIcon";
import MutedIcon from "./MutedIcon";
import palcoImg from "../images/palco.png";
import theme from "../theme";


import {SocketMessage} from './SocketMessage';
import ContainerInteraction from './ContainerInteraction';

const InCall = () => {
  const {
    participants,
    room,
    view,
    getAccountType,
    leaveCall,
    handleMute,
    handleUnmute,
    raiseHand,
    lowerHand,
    endCall,
    mudarAlgoAssim,
    messageChat,
  } = useCallState();

  const audioRef = useRef(null);
 

  const local = useMemo(
    (p) => participants?.filter((p) => p?.local)[0],
    [participants]
  );

  const mods = useMemo(
    () =>
      participants?.filter(
        (p) => p?.owner && getAccountType(p?.user_name) === MOD
      ),
    [participants, getAccountType]
  );
  const speakers = useMemo(
    (p) =>
      participants?.filter((p) => getAccountType(p?.user_name) === SPEAKER),
    [participants, getAccountType]
  );


  useEffect(() => {

    
   
   
  }, []);


  const listeners = useMemo(() => {
    const l = participants
      ?.filter((p) => getAccountType(p?.user_name) === LISTENER)
      .sort((a, _) => {
        // Move raised hands to front of list
        if (a?.user_name.includes("✋")) return -1;
        return 0;
      });
    return (
      <ListeningContainer>
        {l?.map((p, i) => (
          <Participant
            participant={p}
            key={`listening-${p.user_id}`}
            local={local}
            modCount={mods?.length}
          />
        ))}
      </ListeningContainer>
      
    );
   
  }, [participants, getAccountType, local, mods]);


 

  const onlyMod = useMemo(() => {
    const s = [...mods];

    return (
      <CanSpeakContainer>
        {s?.map((p, i) => (
          <Participant
            participant={p}
            key={`speaking-${p.user_id}`}
            local={local}
            modCount={mods?.length}
          />
        ))}
      </CanSpeakContainer>
    );

  }, [mods, speakers, local]);

  const canSpeak = useMemo(() => {
    const s = [...speakers];
    const m = [...mods];

    
    //Orde todos os elementos pelo joined_at
    s.sort((a,b) => a.joined_at - b.joined_at);

    console.log('all speakers', s);
    return (
      <CanSpeakContainer>

          {s?.map((p, i) => (
            <Participant
              participant={p}
              key={`speaking-${p.user_id}`}
              local={local}
             
              speakers={s}
            />
          ))}
       
      </CanSpeakContainer>
    );
  }, [mods, speakers, local]);

  

  const createInitialSpeak = () => {
    return (
      <DivZeroSpeak>
        <img src={palcoImg} style={{position: 'absolute', bottom: '1px'}} alt="img palco vazio" />
        <ZeroSpeakText>Nenhum MC no palco</ZeroSpeakText>
      </DivZeroSpeak>
    );
  };

  
  const handleAudioChange = useCallback(
    () => (local?.audio ? handleMute(local) : handleUnmute(local)), 
    
    [handleMute, handleUnmute, local]);
  const handleHandRaising = useCallback(
    () =>
      local?.user_name.includes("✋") ? lowerHand(local) : raiseHand(local),
    [lowerHand, raiseHand, local]
  );

  return (
    <>
    <Container battleMc={true} hidden={view !== INCALL}>
      
      <BoxPlaco>
        
          <CallHeader>
              {onlyMod}
          </CallHeader>

          {speakers.length === 0 ? (
            createInitialSpeak()
          ) : (
            canSpeak
          )}
   
      </BoxPlaco>
     
        
        <BoxPlateia>
            <ContainerInteraction plateia={listeners} 
                                  room={room}
                                  />    
        </BoxPlateia>
      
     
     
      {/* <Tray>
        <TrayContent>
          {[MOD, SPEAKER].includes(getAccountType(local?.user_name)) ? (
            <AudioButton onClick={handleAudioChange}>
              {local?.audio ? (
                <MicIcon type="simple" />
              ) : (
                <MutedIcon type="simple" />
              )}
              <ButtonText>{local?.audio ? "Mute" : "Unmute"}</ButtonText>
            </AudioButton>
          ) : (
            <HandButton onClick={handleHandRaising}>
              <ButtonText>
                {local?.user_name.includes("✋")
                  ? "Lower hand"
                  : "Raise hand ✋"}
              </ButtonText>
            </HandButton>
          )}
          {mods?.length < 2 && getAccountType(local?.user_name) === MOD ? (
            <LeaveButton onClick={endCall}>End call</LeaveButton>
          ) : (
            <LeaveButton onClick={leaveCall}>Leave call</LeaveButton>
          )}
        </TrayContent>
      </Tray> */}

      

    </Container>
  
    <Audio participants={participants}/>

     
    </>
  );
};

const Container = styled.div`
  max-width:500px;
  background-color: #fff;
  margin: 0 auto;
  visibility: ${(props) => (props.hidden ? "hidden" : "visible")};
  height: ${(props) => (props.hidden ? "0" : "100%")};
  min-height:500px;
  justify-content: ${(props) => (props.battleMc ? 'space-beteween' : 'initial')};
  position:relative;
  height:100vh;
`;

const BoxPlaco = styled.div`
  height:55%;
  overflow:hidden;
`;

const BoxPlateia = styled.div`
  height:45%;
  overflow:hidden;
`;

/*  container dos MCs */
const CanSpeakContainer = styled.div`
  border-bottom: ${theme.colors.grey} 1px solid;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height:fit-content;
`;

/*  container plateia */
const ListeningContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
`;
const Header = styled.h2`
  font-size: ${theme.fontSize.large};
  color: ${theme.colors.greyDark};
`;
const CallHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
  height:1px;
`;
const Tray = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 52px;
  width: 100vw;
  box-sizing: border-box;
  background-color: ${theme.colors.greyLight};
  padding: 12px;
`;
const TrayContent = styled.div`
  max-width: 700px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const Button = styled.button`
  font-size: ${theme.fontSize.large};
  font-weight: 600;
  border: none;
  background-color: transparent;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: ${theme.colors.greyLightest};
  }
`;
const LeaveButton = styled(Button)`
  margin-left: auto;
`;
const HandButton = styled(Button)`
  margin-right: auto;
`;
const AudioButton = styled(Button)`
  margin-right: auto;
  display: flex;
  align-items: center;
`;
const ButtonText = styled.span`
  margin-left: 4px;
`;


const DivZeroSpeak = styled.div`
  width:100%;
  min-height:300px;
  position:relative;
  `;

const ZeroSpeakText = styled.p`
  text-align:center;
  color: #2189a9;
  padding-top:200px;
`;




export default InCall;
