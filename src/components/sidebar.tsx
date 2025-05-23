import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { useState, useEffect } from "react";

const Container = styled.div`
    display: flex;
`;

const OutletWrapper = styled.div`
  flex: 1;
  padding: 50px;
  margin-left: 10%;
  overflow-y: auto;
`;

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 50px 0px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 10%;
  max-height: 100%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    &.profile-item { /* 프로필 사진 아이템에만 overflow 적용 */
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    svg {
        width: 30px;
        height: 30px;
    }
    &.log-out {
        border-color: #1d9bf0;
    }
`;

const LogoItem = styled(MenuItem)` /* Food Journal 로고를 위한 스타일 */
    overflow: visible; /* 넘치는 내용 보이도록 */
    border-radius: 0; /* 원형 테두리 제거 */
    border: none; /* 테두리 제거 */
    height: auto;
    width: auto;
    font-size: 16px;
    font-weight: bold;
`;

export default function Sidebar() {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [profilePhotoURL, setProfilePhotoURL] = useState<string | null>(user?.photoURL || null);

    useEffect(() => {
        if (user?.photoURL) {
            setProfilePhotoURL(user.photoURL);
        }
    }, [user]);

    const onLogout = async () => {
        const ok = confirm("Are you sure you want to log out?");
        if (ok) {
            await auth.signOut();
            navigate("/login");
        }
    };

    return (
        <Container>
            <Wrapper>
                <Menu>
                    <StyledLink to="/">
                        <LogoItem>
                            <div>Food Journal</div>
                        </LogoItem>
                    </StyledLink>
                    <StyledLink to="/profile">
                        <MenuItem className="profile-item">
                            {profilePhotoURL ? (
                                <img src={profilePhotoURL} alt="Profile" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                        </MenuItem>
                    </StyledLink>
                    <StyledLink to="/post">
                        <MenuItem>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </MenuItem>
                    </StyledLink>
                    <StyledLink to="">
                        <MenuItem className="log-out" onClick={onLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                            </svg>
                        </MenuItem>
                    </StyledLink>
                </Menu>
            </Wrapper>
            <OutletWrapper>
                <Outlet />
            </OutletWrapper>
        </Container>
    );
}