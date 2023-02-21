import React from "react";
import ReactDOM from 'react-dom';



export default async function MixedAudios ({myBeat}){
    
   // const audioRef = React.createRef();
 
   let beat = myBeat.current;

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

  

   return streamBeat.getAudioTracks()[0];


        // const elemSource =  React.createElement('source', { 
        //     type: 'audio/mpeg',
        //     ref: audioRef,
        //     src: Music  });
        
        //    const elemAudio =  React.createElement('audio', { 
        //     controls: 'controls'}, [elemSource]
        //     );
   
            
        // ReactDOM.render(elemAudio, document.getElementById('myBeat'));
  

        //     setTimeout(() => {
        //         console.log(audioRef.current);
        //         audioRef.current.play();
        //     }, 2000);
    

   // let beat = createBeat();
    // const createBeat = () => {

    //     let beat      = document.createElement('audio');
    //     beat.ref      = {audioRef};
    //     beat.id       = 'audio-player';
    //     beat.controls = 'controls';
    //     beat.src      = {Music};
    //     beat.type     = 'audio/mpeg';
    //     document.getElementById('myBeat').appendChild(beat);
    
    // }

   // let beat = audioRef.current;
    // console.log('meu beeet foi criado?', beat);

   

}
   
