import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Alert = styled.div`
  background-color: #f44336; /* Red */
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  text-align: center;
`;

const TopBar = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  color: #1d9bf0;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const PostContainer = styled.div`
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 95%;
  max-width: 700px;
  margin: 40px auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const TextArea = styled.textarea`
  border: 1px solid white;
  padding: 16px;
  border-radius: 16px;
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: black;
  background-color: #c71d1d;
  width: 100%;
  height: 200px;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const AttachFileIcon = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  color: #1d9bf0;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    stroke: #1d9bf0;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    width: 600px;
  }
  .placeholder {
    height: 300px;
    width: 100%;
    aspect-ratio: 4 / 3;
    background-color: #eaeaea;
  }
  button {
    position: absolute;
    top: -10px;
    right: -10px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
  }
`;

export default function PostForm() {
  const [isLoading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isFileSizeTooBig, setIsFileSizeTooBig] = useState(false);

  useEffect(() => {
    setCanSubmit(post.trim() !== "" || file !== null);
  }, [post, file]);

  useEffect(() => {
    if (isFileSizeTooBig) {
      setErrorMessage("파일 크기가 2MB를 초과합니다.");
      // 일정 시간 후 에러 메시지 초기화 (선택 사항)
      setTimeout(() => {
        setErrorMessage(null);
        setIsFileSizeTooBig(false);
      }, 3000);
    }
  }, [isFileSizeTooBig]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const selectedFile = files[0];
      if (selectedFile.size > 2 * 1024 * 1024) {
        setIsFileSizeTooBig(true);
        setFile(null);
        setImagePreview(null);
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setIsFileSizeTooBig(false);
    } else {
      setFile(null);
      setImagePreview(null);
      setIsFileSizeTooBig(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file === null && post.trim() === "") {
      setErrorMessage("사진 또는 글을 하나 이상 작성해주세요.");
      return;
    }
    if (isFileSizeTooBig) {
      setErrorMessage("파일 크기가 2MB를 초과합니다.");
      return;
    }

    const user = auth.currentUser;
    if (!user || isLoading || post.length > 180) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const doc = await addDoc(collection(db, "posts"), {
        post,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(
          storage,
          `posts/${user.uid}/${user.displayName}/${doc.id}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setPost("");
      setFile(null);
      setImagePreview(null);
    } catch (e) {
      console.log(e);
      setErrorMessage("포스트 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const goHome = () => navigate("/");

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
    setIsFileSizeTooBig(false);
  };

  return (
    <PostContainer>
      <TopBar onClick={goHome}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 12l7.5-7.5m0 0L18 12m-7.5-7.5V21" />
        </svg>
      </TopBar>
      <Form onSubmit={onSubmit}>
        {errorMessage && <Alert>{errorMessage}</Alert>}
        <ImagePreviewContainer>
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="preview" />
              <button type="button" onClick={handleRemoveImage}>✕</button>
            </>
          ) : (
            <div className="placeholder" />
          )}
        </ImagePreviewContainer>
        <TextArea
          rows={5}
          maxLength={180}
          onChange={onChange}
          value={post}
          placeholder="Tell us your secret recipes..."
        />
        <ButtonWrapper>
          <AttachFileIcon htmlFor="file">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
          </AttachFileIcon>
          <AttachFileInput
            onChange={onFileChange}
            type="file"
            id="file"
            accept="image/*"
          />
          <SubmitBtn type="submit" disabled={file === null && post.trim() === "" || isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 10l9 4-9 4V10z M13 6h6M13 12h6m-6 6h6" />
            </svg>
          </SubmitBtn>
        </ButtonWrapper>
      </Form>
    </PostContainer>
  );
}