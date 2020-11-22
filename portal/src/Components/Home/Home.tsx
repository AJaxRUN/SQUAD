import React, { useState, useRef } from 'react'
import {
  Row,
  Col,
  Button,
  InputGroup,
  FormControl
} from 'react-bootstrap'
import './Home.css'
//@ts-ignore
import withRouter from 'react-router-dom/withRouter'

const Home = (props: any) => {
  return (
    <div className="d-flex h-100 align-items-center justify-content-center page_bg">
      <CreateJoinMeeting {...props}/>
    </div>
  );
}

const CreateJoinMeeting = (props: any) => {
  const meetingIdInput = useRef(null) as React.MutableRefObject<HTMLInputElement | null>;

  const [ joinPortalButtonState, setJoinPortalButtonState ] = useState({
    name: "--__--",
    disabled: true
  })

  const enableJoinPortal = () => {
    const meetingId = meetingIdInput.current?.value
    if(meetingId && meetingId.trim() !== '' && /[0-9]+/.test(meetingId)) {
      setJoinPortalButtonState({
        name:"Enter Portal",
        disabled: false,
      })
    }
    else
      setJoinPortalButtonState({
        name: "--__--",
        disabled: true
      })
  }

  const createPortalRedirect = () => props.history.push('/createPortal')

  return (
    <div className="create-join_bg mx-auto rounded">
      <Row className="flex justify-content-md-center mt-2">
        <Col sm="auto">
          Enter portal ID to join a meeting or{" "}
          <Button variant="outline-warning" size="sm" onClick={createPortalRedirect}>
            Create a portal
          </Button>
          {" "}to host a meeting
        </Col>
      </Row>
      <Row className="flex justify-content-md-center mt-2">
        <Col sm="auto">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="meetingID">#</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Portal/Meeting ID"
              ref={meetingIdInput}
              onChange={enableJoinPortal}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="flex justify-content-md-center mt-2">
        <Col sm="auto">
          <Button
            variant="primary"
            disabled = {joinPortalButtonState.disabled}
          >
            {joinPortalButtonState.name}
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default withRouter(Home);