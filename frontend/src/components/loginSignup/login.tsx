import React, { useState } from 'react';
import { Card } from '@material-ui/core';
export function Login(props:LoginProps)
{
    const [userName,setUserName]=useState('')
    const [password,setPassword]=useState('')

    function onChange(value:string,id:string)
    {
       switch(id)
       {
           case "userName":
               {
                setUserName(value)

               }
            case "password":
                {
                    setPassword(value)
                }
       }
    }
    function validation(id:string)
    {
        switch(id)
        {
            case "userName": 
            {

            }
        }
    }
    return(
    <>
      <Card>
          Otha
          {console.log(props.isAuthed) }
      </Card>

    </>
    )
}
interface LoginProps{
isAuthed:boolean
}