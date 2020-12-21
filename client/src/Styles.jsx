import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 3fr;
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(31, 31, 88);
  background-color: #f0f2f5;
`;

export const Main = styled.div`
  grid-area: 1 / 1 / span 1 / span 2;
  justify-self: center;
  width: 100%;
  margin: 5px;
  padding: 5px;
  border: 1px solid gray;
`;

export const ChatContainer = styled.div`
  grid-area: 2 / 1 / span 1 / span 1;
  justify-self: center;
  width: 90%;
  margin: 5px;
  padding: 5px;
`;

export const InfoContainer = styled.div`
  grid-area: 2 / 2 / span 1 / span 1;
  justify-self: center;
  width: 90%;
  margin: 5px;
  padding: 5px;
`;

export const ChatBox = styled.div`
  display: grid;
  grid-template-rows: 70px 1fr 50px;
  background-color: white;
  border-radius: 12px;
  max-height: 600px;
  margin: 18px 2px;
`;

export const InfoBox = styled.div`
  display: grid;
  grid-template-rows: 70px 1fr 50px;
  background-color: white;
  border-radius: 12px;
  height: 400px;
  margin: 18px 2px;
  padding: 12px;
`;

export const ChatTop = styled.div`
  grid-area: 1 / 1 / span 1 / span 1;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 60px 1fr;
  padding: 12px;
`;

export const ChatName = styled.div`
  grid-area: 1 / 2 / span 1 / span 1;

`;

export const ChatTime = styled.div`
  grid-area: 2 / 2 / span 1 / span 1;

`;

export const ChatImage = styled.div`
  grid-area: 1 / 1 / span 2 / span 1;

`;

export const ChatIcon = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

export const ChatMiddle = styled.div`
  grid-area: 2 / 1 / span 1 / span 1;
  padding: 12px;
`;

export const ChatBottom = styled.div`
  grid-area: 3 / 1 / span 1 / span 1;
  padding: 12px;
`;