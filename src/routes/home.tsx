import styled from "styled-components";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
    display: flex; /* flexbox 레이아웃 사용 */
    margin-left: 10%; /* Sidebar 너비만큼 왼쪽 마진을 줘서 내용이 가려지지 않게 함 */
    width: 90%; /* 남은 너비를 차지하도록 설정 */
    padding: 20px; /* 내용 주변에 약간의 패딩 추가 */
    overflow-y: auto; /* 내용이 넘칠 경우 스크롤 가능하도록 설정 */
`;

export default function Home(){
    return (
        <Wrapper>
            <Timeline />
        </Wrapper>
    )
}