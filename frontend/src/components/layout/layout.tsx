import React, { useState } from 'react';
import { Card } from '@material-ui/core';
import {Button} from '@material-ui/core'
import './layout.css';
export function Layout()
{
    const [participant,setParticipant]=useState<participants[]>([])
    const [layout,setLayout]=useState<any[]>([{height:"100%", width:"100%"}])
    const [stream,setStream]=useState<MediaStream>();
    const width=96;
    const height=96;
    const constraints={audio:false, video:true}
    
    function incrementparticipant(operation:string)
    {
        
        var x:any;
        var y:any;
       switch(operation)
       {
           

           case "increment":
               {
               if(participant.length===6)
                {
                    
                }
               else{
                    x=[...participant];
                   x.push({id:participant.length+1})
                  
                setParticipant(x);
               
               }
               break;
            }
                
            case "decrement":
                {
                    if(participant.length===1)
                    {}
                    else{
                        x=[...participant];
                        x.pop()
                        setParticipant(x);
                    }
                    break;
                 }

       }
       
       console.log(participant.length);

       
    } 
    React.useEffect(()=>{
        var y:any;
        var participantLength=participant.length;
        if(participantLength>0 && participantLength<=2 )
        {
            var y:any=[];
            let w=(Math.floor(width/participantLength)).toString()+"%";
            let h=height.toString()+"%";
            for(let i=0; i<participantLength; i++)
            {
                y.push({height:h, width:w});
            }
            console.log(y);
            setLayout(y);
        }
        else if(participantLength>2 && participantLength<=4)
        {
            var y:any=[];
            let w=(Math.floor(width/2)-1).toString()+"%";
            let h=(Math.floor(width/2)-1).toString()+"%";
            for(let i=0; i<participantLength; i++)
            {
                y.push({height:h, width:w});
            }
            console.log(y);
            setLayout(y);
        }
        else if(participantLength>4 && participantLength<=6){
            var y:any=[];
            let w=(Math.floor(width/3)-1).toString()+"%";
            let h=(Math.floor(width/2)-1).toString()+"%";
            for(let i=0; i<participantLength; i++)
            {
                y.push({height:h, width:w});
            }
            console.log(y);
            setLayout(y);
        }
        else if(participantLength>6 && participantLength<=9){

        }
        joker()
       
    },[participant] )
    async function joker(){
        setStream(await navigator.mediaDevices.getUserMedia(constraints));
        participant.forEach(element => {
            (document.querySelector("#video"+element.id.toString())! as HTMLVideoElement).srcObject=stream!;
        });
    }
    return(
    <>
        <div>
            <Button color="primary" onClick={()=>{incrementparticipant("increment")}}>+</Button>
            <Button color="primary" onClick={()=>{incrementparticipant("decrement")}}>-</Button>
        </div>
        <div className="wrapper">
        { 
        participant.map((ele,i)=>
           
            {
            if(layout[i]!=undefined)
            {
            return(
            <Card key={ele.id}  className="CardLayout" style={{width:layout[i].width, height:layout[i].height}}>
                
                
         
           <video id={"video"+ele.id.toString()} autoPlay width="100%" height="100%" className="video"></video>
            
            <div style={{backgroundColor:"blue", width:"100%", height:"20px"}} className="box stack-top"></div>
           
            </Card>
            )
           
            }
            }
        )
    }
        </div>
        
    </>
    )
}

interface participants{
id:number
} 
