import React, { useState, useEffect } from 'react';

const Info = (props) => {

  const [ loading, setLoading ] = useState(true)

  return (
    <div>
      <h3>Event Information</h3>
      <div>
        {props.eventData.title}
      </div>
      <div>
        {props.eventData.location}
      </div>
      <div>
        {props.eventData.description}
      </div>
      <div>
        {props.eventData.startTime}
      </div>
    </div>
  )
}

export default Info;