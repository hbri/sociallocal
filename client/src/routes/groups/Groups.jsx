import React, {
  useEffect,
  useState
} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GroupContainer } from './groupStyle.js';

const Groups = () => {

  const [ allGroups, setAllGroups ] = useState(null);

  const requestBody = {
    query: `
      query {
        allGroups {
          _id
          name
        }
      }
    `
  }

  const getGroups = async () => {
    const fetchedData = await axios({
      url: '/graphql',
      method: 'post',
      data: requestBody
    })

    setAllGroups(fetchedData.data.data.allGroups)
  }

  useEffect(() => {
    getGroups()
  }, [])

  return allGroups ? (
    <GroupContainer>
      <h4>All Groups</h4>
      <ul>
      {
        allGroups.map((group) => (
          <li><Link to={`/groupdetail/${group._id}`} >{group.name}</Link></li>
        ))
      }
      </ul>
    </GroupContainer>
  ) : (
    <p>Loading ...</p>
  )
}

export default Groups;