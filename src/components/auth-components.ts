import { styled } from "styled-components";

export const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 420px;
    padding: 50px 0px;
`;

export const Form = styled.form`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
    color: black;
`;

export const Input = styled.input`
    display: block;
    margin: 20px auto 0 auto;
    padding: 20px 30px;
    width: 400px;
    height: 70px;
    border-radius: 20px;
    border: none;
    font-size: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background-color: white;

    &[type="submit"] {
        border-radius: 15px;
        width: 50%;
        height: 50px;
        padding: 15px 0;
        margin-top: 30px;
        align-self: center;
        color: black;
        background-color: white;
        cursor: pointer;
        transition: background-color 0.3s;
        &:hover {
            background-color: rgb(231, 231, 231);
        }
    }
`;

export const Error = styled.span`
    margin: 18px 0px 18px 0px;
    font-size: 15px;
    font-weight: 600;
    color: tomato;
`;

export const Success = styled.span`
    margin: 18px 0px 18px 0px;
    font-size: 15px;
    font-weight: 600;
    color:rgb(116, 189, 123);
`;

export const SwitcherContainer = styled.div`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center;
`;

export const Switcher = styled.span`
    margin-top: 10px;
    color: gray;
    a {
        color:rgb(0, 0, 0);
    }
`;

export const Title = styled.h1`
    margin: 20px 0 60px 0;
    font-size: 45px;`