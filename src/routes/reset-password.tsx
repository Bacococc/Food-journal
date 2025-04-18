import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { Input, Switcher, Title, Wrapper, Error, Success } from "../components/auth-components";

export default function ResetPassword(){
    const[isLoading, setLoading] = useState(false);
    const[email, setEmail] = useState("");
    const[error, setError] = useState("");
    const[success, setSuccess] = useState("");
    const navigate = useNavigate();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: {name, value} } = e;
        if (name === "email") {
            setEmail(value)
        } 
    };
    //이메일 입력 처리

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "") return; //로딩 중이거나 이메일이 비었을 때, 프로세스 종료
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            setSuccess("비밀번호 재설정 이메일이 전송되었습니다. Redirect to login page...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (e) {
            if(e instanceof FirebaseError) {
                setError(e.message)
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <Title>Reset Password 𝕏</Title>
            <Form onSubmit={onSubmit}>
                <Input name="email" placeholder="Email" type="text" required onChange={onChange} disabled={isLoading} />
                <Input type="submit" value={isLoading ? "Sending email..." : "Send reset email"} disabled={isLoading} />
            </Form>
            {success && <Success>{success}</Success>}
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                <Link to={"/login"}>Log in to 𝕏</Link>
            </Switcher>
        </Wrapper>
)};