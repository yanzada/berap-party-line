import * as React from 'react';
import {CallContext} from '../CallProvider';

import { MessageList, Input, Button } from 'react-chat-elements'
import CopyLinkBox from "./CopyLinkBox";


import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import InsertLinkIcon from '@mui/icons-material/InsertLink';


//css
import 'react-chat-elements/dist/main.css'
import '../css/ContainerInteraction_module.css';



//Main func
export default function ContainerInteraction({plateia, room, mod}) {
    
    const { messageChat, NewMessageChat, newWow} = React.useContext(CallContext); 
    
    const [value, setValue] = React.useState(1);
    const messageListReferance = React.createRef();
    const inputReferance = React.createRef();
    const lastMessage = React.useRef();
    const [allMessageChat, setAllMessageChat] = React.useState([{message:'Seja bem vindo',mySelf: true,}, {message:'Seja bem vindo',mySelf: false,}, {message:'Seja bem vindo',mySelf: false,}, {message:'Seja bem vindo',mySelf: false,}, {message:'Seja bem vindo',mySelf: false,}, {message:'Seja bem vindo',mySelf: false,}, {message:'Seja bem vindo',mySelf: false,} ]);
    const messagesEndRef = React.createRef();
    const containerChatMessageTab = React.createRef();
   
    React.useEffect(() => {

        if(messageChat[0]){
            if(lastMessage.current === messageChat[0].message){
                return false;
            }
            else{
                let newMessage = [messageChat[0]];
                setAllMessageChat(allMessageChat => [...allMessageChat,...newMessage]);
                lastMessage.current = messageChat[0].message;

                scrollToBottom();
                
            }      
        }
        
      

    });


   


    const scrollToBottom = () => {
        console.log('entri no scroll?');
       
       
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
       
       // let posicoes = messagesEndRef.current.getBoundingClientRect();
       

       // console.log('end message', posicoes);

        let ultimo = allMessageChat.at(-1);
        console.log(ultimo);
      
        
        //  console.log('posição', posicoes);
       // $(this).scrollTop(posicoes.top);
    //    const yOffset = 20000;
    //     const y = messagesEndRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    //     console.log('meu y', y);
    //     window.scrollTo({top: y, behavior: 'smooth'});
       
      }

  const handleSendMessage = () => {
    let valueTextArea = inputReferance.current.value;
   
    
    //add in array  
    let newMessage = [{
        "message": valueTextArea,
        "mySelf": true,
    }];
  
    setAllMessageChat(allMessageChat => [...allMessageChat,...newMessage]);
   
    //emit
     let emitNewMessage = [{
        "message": valueTextArea,
        "mySelf": false,
    }];
    NewMessageChat(emitNewMessage);
    

    //clear
    inputReferance.current.value = '';
    inputReferance.current.focus();
    
   
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
 
          
  
    
  }//end func
   

    const actions = [
        { icon: <MarkUnreadChatAltIcon />, name: 'Chat', value: 1 },
        { icon: <GroupsIcon />, name: 'Plateia', value: 2 },
        { icon: <InsertLinkIcon />, name: 'Link', value: 3 },
    ];

    
      

  return (

   
    
    <div className="myBox">

       
        

        {/*CHAT */ }
        {value === 1 && (
            <div className="boxTabPanel">
     
                <div className="containerChatMessageTab" ref={containerChatMessageTab}>
  
                  { allMessageChat.map((el, index) => (
                        <div className={el.mySelf ? 'divMessageListRight' : 'divMessageListLeft'}>
                          <MessageList
                              referance={messageListReferance}
                              className='MessageListCss'
                              lockable={false}
                              toBottomHeight={'100%'}
                              dataSource={[
                                  {
                                      position: el.mySelf ? 'right' : 'left',
                                      type: 'text',
                                      text: el.message,
                                  },
                              ]} 
                          />

                          {!el.mySelf && <span className="nameSendMessageLeft">Yanzada</span>}
                        </div>          
                  ))} 
                
               
                <div className="messageEnd" ref={messagesEndRef} />
                </div>
  
  
                <div class="boxSendMessage">
                    <Input
                        referance={inputReferance}
                        placeholder='Sua mensagem...'
                        multiline={true}
                        rightButtons={<Button color='white' onClick={handleSendMessage} backgroundColor='green' text='Enviar' />}
                    />
                </div>
            </div>
        )}


          {/* PLATEIA */ }
          {value === 2 && (
              <div className="boxTabPanel">
                   {plateia}
             </div>
        )}

        
        {/* LINK */ }
        {value === 3 && (
              <div className="boxTabPanel">
                   <CopyLinkBox room={room} />
             </div>
        )}
      

      {/* MENU FLUTUANTE */ }      
    <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 5, left: 5 }}
        icon={<SpeedDialIcon />}
        
    >
        {actions.map((action) => (
        <SpeedDialAction
            key={action.name}
            icon={action.icon}
            value={action.value}
            tooltipTitle={action.name}
            onClick={() => setValue(action.value)}
            
        />
        ))}
    </SpeedDial>

      
   

  </div>
 
  );

  
}

