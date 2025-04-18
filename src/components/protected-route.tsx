import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
    children,
} : {
    children : React.ReactNode;
}) {
    const user = auth.currentUser; //firebase 에게 유저 정보(user or null)를 물어봄
    if(!user) {
        return <Navigate to ="/login"/>
    }
    return children
} 