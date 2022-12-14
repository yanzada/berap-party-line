import * as React from 'react';
import CopyLinkBox from "./CopyLinkBox";
import styled, { isStyledComponent } from "styled-components";



import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';

import 'react-chat-elements/dist/main.css'
// MessageBox component
import { MessageList, Input, Button } from 'react-chat-elements'

import {CallContext} from '../CallProvider';

import '../css/ContainerInteraction_module.css';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
   

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography component={'span'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }


function LinkTab(props) {
    return (
      <Tab
        component="a"
        onClick={(event) => {
          event.preventDefault();
        }}
        {...props}
      />
    );
  }

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }




  //Main func
export default function ContainerInteraction({plateia, room}) {
    

    const {setMessageChat, messageChat, NewMessageChat} = React.useContext(CallContext); 
    
    
    const [value, setValue] = React.useState(0);
    const messageListReferance = React.createRef();
    const inputReferance = React.createRef();
   
    const lastMessage = React.useRef();
    const [allMessageChat, setAllMessageChat] = React.useState( [
        {
            message:'Seja bem vindo',
            mySelf: false,
        }
    ]);

   
    React.useEffect(() => {

        if(messageChat[0]){

            if(lastMessage.current === messageChat[0].message){
                return false;
            }
            else{
                console.log('CHEGOU ESSA NOVA MENSAGEM AQUI PARÇA!!!!!', messageChat[0]);
                let newMessage = [messageChat[0]];
                setAllMessageChat(allMessageChat => [...allMessageChat,...newMessage]);
                lastMessage.current = messageChat[0].message;
            }

           
            
        }   

    });


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
    
    
    console.log(allMessageChat);
  }
   
    
    const handleChange = (event, newValue) => {
      
        setValue(newValue);
    };

   
      

  return (
    <div className="myBox">
      <Tabs orientation="vertical"
            variant="scrollable"value={value} 
            onChange={handleChange} 
            aria-label="nav tabs example"
            sx={{ borderRight: 1, borderColor: 'divider' }}
        >
            <LinkTab label="Chat" {...a11yProps(0)} />
            <LinkTab label="Plateia" {...a11yProps(1)} />
            <LinkTab label="Link" {...a11yProps(2)} />
    </Tabs>


    <div class="boxTabPanel">
   
   
        <TabPanel value={value} index={0}>


        <div className="boxTabPanelChat">
            <div className="containerChatMessageTab">


                {
                allMessageChat.map((el, index) => (
                    <>
                    {console.log('EU NÃO ENTRO AQUI? ', index)}
                    <div className={el.mySelf ? 'divMessageListRight' : 'divMessageListLeft'}>
                        <MessageList
                            referance={messageListReferance}
                            className='MessageListCss'
                            lockable={true}
                            toBottomHeight={'100%'}
                            dataSource={[
                                {
                                    position: el.mySelf ? 'right' : 'left',
                                    type: 'text',
                                    text: el.message,
                                },
                            ]} 
                        />
                        <span className={el.mySelf ? 'nameSendMessageRight' : 'nameSendMessageLeft'}>Yanzada</span>
                
                    </div>
                </>
                ))
                } 

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
   
        </TabPanel>

    
   
   

  
        <TabPanel value={value} index={1}>
        {plateia}
        </TabPanel>
  
        <TabPanel value={value} index={2}>
            <CopyLinkBox room={room} />
        </TabPanel>
    </div>

  </div>
  );
}

