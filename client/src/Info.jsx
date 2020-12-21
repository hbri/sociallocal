import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon'
import { InfoBox } from './Styles.jsx'

const Info = (props) => {

  const convertTime = function(isostring) {
    const luxonObj = DateTime.fromISO(isostring);
    const relative = luxonObj.toLocaleString(DateTime.DATETIME_SHORT);
    return relative
  }

  return (
    <InfoBox>
      <h3>Event Information</h3>
      <div>
        Title: {props.eventData.title}
      </div>
      <div>
        Location: {props.eventData.location}
      </div>
      <div>
        Description: {props.eventData.description}
      </div>
      <div>
        <p>
          Starts: {convertTime(props.eventData.time.start)}
        </p>
        <p>
          Ends: {convertTime(props.eventData.time.end)}
        </p>
      </div>
    </InfoBox>
  )
}

export default Info;