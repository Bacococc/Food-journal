import styled from "styled-components";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
    margin-left: 10%; /* Sidebar 너비만큼 왼쪽 마진 */
    width: 90%; /* 남은 너비 차지 */
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr; /* 하나의 컬럼 */
    grid-template-rows: auto; /* 높이를 내용에 따라 자동 조정 */
    gap: 20px; /* 요소 사이 간격 */
    overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
`;

export default function Home(){
    return (
        <Wrapper>
            <Timeline />
        </Wrapper>
    )
}