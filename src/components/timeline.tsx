import { useEffect, useState } from "react";
import { Wrapper } from "./auth-components";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export interface IPost {
    id:string;
    photo:string;
    post:string;
    userId:string;
    username:string;
    createdAt:number;
}
export default function Timeline(){
    const[posts, setPost] = useState<IPost[]>([]);
    const fetchPost = async() => {
        const postsQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc")
        );
        const spanshot = await getDocs(postsQuery);
        const newPosts = spanshot.docs.map((doc) => {
            const { post, createdAt, userId, username, photo } = doc.data();
            return {
                post, 
                createdAt, 
                userId,
                username, 
                photo, 
                id:doc.id,
            };
        });
        setPost(newPosts);
    }; // Added closing brace for fetchPost function
    useEffect(() => {
        fetchPost();
    }, []);

    return ( <Wrapper>{JSON.stringify(posts)}</Wrapper>
    )

}