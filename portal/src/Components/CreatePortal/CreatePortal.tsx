import React, { useState, useEffect } from 'react'
import {
  Row,
  Button,
  Spinner
} from 'react-bootstrap'
import './CreatePortal.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Copy } from 'react-feather'
import { getNewRoomId } from '../../utils/fetchCalls';

const CreatePortal = (props: any) => {
    const [ portalId, setPortalId ] = useState('loading')
    let portalIdElement:String | JSX.Element | null= '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(portalId).then(function() {
            console.log('Async: Copying to clipboard was successful!');
          }, function(err) {
            console.error('Async: Could not copy text: ', err);
          });
        // document.execCommand("copy");
    }
    useEffect(() => {
        getNewRoomId()
            .then(response => {
                console.log(response)
                //@ts-ignore
                setPortalId("/portal/"+response.portalId)
            })
            .catch(err =>{
                console.log(err)
            });
    }, []);

    if(portalId === 'loading') {
        portalIdElement = <Spinner animation="border" variant="primary" />
    }

    else if(portalId === 'error') {
        portalIdElement = "Oops! Some error occured please try again later! :("
    }

    else {
        portalIdElement = 
            <>
                <span className="meeting_link_text">
                    Meeting link(click to continue):
                </span>
                &nbsp;
                <Link to={portalId} className="meeting_link">
                    {portalId}
                </Link>
                &nbsp;
                <span className="copy_icon rounded mt-2">
                    <Copy onClick={copyToClipboard} />&nbsp;
                    Copy link to clipboard
                </span>
            </>
    }

    return (
        <div className="d-flex h-100 align-items-center justify-content-center page_bg">
            <div className="create-join_bg mx-auto rounded">
                <Row className="flex justify-content-md-center">
                    {portalIdElement}
                </Row>
            </div>
        </div>
    );
}

  
export default CreatePortal;