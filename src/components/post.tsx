import { IPost } from "./timeline";
import styled from "styled-components";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba;
    border-radius: 15px;
    background-color: white;

`;

const Column = styled.div`

`;
const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
    `;

const Payload = styled.p``;
const Photo = styled.img`
    width: 100px;
    height: 100px;
`;

export default function Post({ username, photo, post }: IPost) {
    return (
      <Wrapper>
        <Column>
          <Username>{username}</Username>
          <Payload>{post}</Payload>
        </Column>
        {photo ? (
          <Column>
            <Photo src={photo} />
          </Column>
        ) : null}
      </Wrapper>
    );
  }