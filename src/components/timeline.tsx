import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Post from "./post";

export interface IPost {
    id: string;
    photo: string;
    post: string;
    userId: string;
    username: string;
    createdAt: number;
}

const TimelineWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr; /* 하나의 컬럼으로 포스트 나열 */
    gap: 20px; /* 포스트 사이 간격 */
`;

export default function Timeline() {
    const [posts, setPost] = useState<IPost[]>([]);
    const fetchPost = async () => {
        const postsQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(postsQuery);
        const newPosts = snapshot.docs.map((doc) => {
            const { post, createdAt, userId, username, photo } = doc.data();
            return {
                post,
                createdAt,
                userId,
                username,
                photo,
                id: doc.id,
            };
        });
        setPost(newPosts);
    };
    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <TimelineWrapper>
            {posts.map((post) => (
                <Post key={post.id} {...post} />
            ))}
        </TimelineWrapper>
    );
}