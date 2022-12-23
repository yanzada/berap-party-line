import * as React from 'react';
import styled from "styled-components";

import {CallContext} from '../CallProvider';
import Floating from '../lib/Floating';


export const SendWow = () => {

    const { NewMessageChat, setNewWow, newWow} = React.useContext(CallContext); 
    const [countWow, setCountWow] = React.useState(0);
    const textWow = React.useRef();

    const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min;
      };
    
      const getRandomColor2 = () => {
        let arrayColor = [
          "#8e44ad",
          "#e7125f",
          "#24b8c1",
          "#2ecc71",
          "#55E6C1",
          "#f44336",
          "#3B3B98",
        ];
    
        let num = parseInt(getRandomNumber(0, 6));
    
        return arrayColor[num];
      };


    const handleEmitWow = (e) => {

        if (countWow < 4) {
            console.log('count atual: ',countWow);
            setCountWow((old) => old + 1);
            
            //emit
            let emitNewMessage = 'wow';
            NewMessageChat(emitNewMessage);

            e.preventDefault();
           
            //send to me
            let wow = 'wow'+ Math.random();
            setNewWow(wow);

          } else {
            setCountWow(0);
            console.log('count atual else: ',countWow);
            textWow.current.style.display = 'none';
            ctrlReacting();
          }    
    };



      const ctrlReacting = () => {
        if (countWow >= 4) {
          setTimeout(() => {
            textWow.current.style.display = 'block';
        }, 3000);
        }
      };


      React.useEffect(() => {
        console.log('my_wow ', newWow);
        if(newWow){

            Floating({
                content: "wow",
                number: 1,
                duration: 5,
                repeat: 1,
                size: 2,
                color: getRandomColor2(),
                classNumber: parseInt(getRandomNumber(0, 60)),
                position:true
              });
        }

      });


    return (
        <ContainerWow>
            <TextWow ref={textWow} onClick={handleEmitWow}>WoW!</TextWow>
        </ContainerWow>
    )
};




const ContainerWow = styled.div`
  width:90px;
  height:90px;
  position: absolute;
  border:1px solid #528123;
  background-color:#528123;
  border-bottom-right-radius:100px;
`;

const TextWow = styled.p`
  font-size:28px;
  -webkit-transform: rotate(-35deg); 
    -moz-transform: rotate(-35deg); 
    margin-top:15px;
    font-weight:600;
    color:#ededed;
`;
