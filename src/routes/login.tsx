import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { Input, Switcher, Title, Wrapper, Error, SwitcherContainer } from "../components/auth-components";


export default function Login(){
    const[isLoading, setLoading] = useState(false);
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");
    const navigate = useNavigate();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: {name, value} } = e;
        if (name === "email") {
            setEmail(value)
        } else if (name === "password"){
            setPassword(value)
        } 
    }
    //firebase 로그인
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "" || password === "")return; //로딩 중이거나 2 항목 중 하나라도 비었을 때, 프로세스 종료
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
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
            <Title>Log in to Food journal</Title>
            <Form onSubmit={onSubmit}>
                <Input name="email" placeholder="Email" type="text" required onChange={onChange}/>
                <Input name="password" 
                    placeholder="Password" 
                    type="password" 
                    required
                    onChange={onChange}
                />
                <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <SwitcherContainer>
                <Switcher>
                    Don't have an Account? <Link to={"/create-account"}>Create one →</Link>
                </Switcher>
                <Switcher>
                    Forgot your Password? <Link to={"/reset-password"}>Reset password →</Link>
                </Switcher>
            </SwitcherContainer>
            
        </Wrapper>
)};