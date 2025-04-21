import styled from "styled-components";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase"; // db 객체 import
import Post from "../components/Post"; // Post 컴포넌트 임포트

// 우측 메인 콘텐츠 영역
const MainContent = styled.div`
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
`;

const AvatarLarge = styled.div`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: #ccc;
    overflow: hidden;
    margin-bottom: 20px;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const Username = styled.h2`
    font-size: 24px;
    margin-bottom: 10px;
`;

const Bio = styled.p`
    color: #555;
    text-align: center;
    margin-bottom: 20px;
`;

const EditProfileButton = styled.button`
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 30px;
`;

const PostsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
`;

interface IPostData {
    id: string;
    post: string;
    createdAt: number;
    photo?: string;
}

export default function MyPage() {
    const user = auth.currentUser;
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(user?.photoURL);
    const [displayName, setDisplayName] = useState(user?.displayName || "Anonymous");
    const [posts, setPosts] = useState<IPostData[]>([]);

    useEffect(() => {
        if (user) {
            setProfileImage(user.photoURL);
            setDisplayName(user.displayName || "Anonymous");
            fetchPosts();
        }
    }, [user]);

    const fetchPosts = async () => {
        if (!user?.uid) return;
        const postQuery = query(
            collection(db, "posts"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(postQuery);
        const fetchedPosts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as IPostData[];
        setPosts(fetchedPosts);
    };

    const handleEditProfileClick = () => {
        navigate("/edit-profile");
    };

    return (
        <MainContent>
            <AvatarLarge>
                {profileImage && <img src={profileImage} alt="Large Avatar" />}
            </AvatarLarge>
            <Username>{displayName}</Username>
            <Bio>This is Baco's home page! I love to cooking with various coussins!</Bio>
            <EditProfileButton onClick={handleEditProfileClick}>Edit profile</EditProfileButton>
            <PostsGrid>
                {posts.map(postData => (
                    <Post
                        key={postData.id}
                        id={postData.id}
                        username={displayName} // 프로필 페이지에서는 현재 유저의 이름 사용
                        photo={postData.photo}
                        post={postData.post}
                        userId={user?.uid || ""} // 현재 유저의 uid 전달
                    />
                ))}
            </PostsGrid>
        </MainContent>
    );
}