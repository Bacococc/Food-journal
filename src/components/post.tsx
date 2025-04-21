import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { IPost } from "./timeline";
import styled from "styled-components";
import { deleteObject, ref } from "firebase/storage";
import { useState, useRef, useEffect } from "react"; // useRef 및 useEffect 추가

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  border-radius: 5px;
  border: 10px solid white; /* 흰색 테두리 */
  max-width: 400px; /* 너비 제한 */
  position: relative; /* 옵션 메뉴 위치 기준점 */
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5; /* 이미지 비율 유지 */
  overflow: hidden;
  background-color: #f9f9f9; /* 이미지 없을 때 배경색 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column; /* 사용자 정보와 글 내용을 세로로 배치 */
  align-items: flex-start;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* 사용자 정보와 글 내용 간 간격 */
`;

const Username = styled.span`
  font-weight: bold;
  font-size: 14px;
  margin-right: 8px;
`;

const Payload = styled.p`
  font-size: 12px;
  color: #333;
  white-space: pre-wrap; /* 줄바꿈 유지 */
  overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
  margin-top: 0; /* Username과의 간격 조절 */
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  color: #777;
  margin-left: auto; /* TextContainer 끝으로 이동 */
`;

const OptionsMenu = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
  display: flex;
  gap: 5px;
  padding: 5px;
  z-index: 10; /* 다른 요소 위에 표시 */
`;

const OptionButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 12px;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 3px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default function Post({ username, photo, post, userId, id }: IPost) {
  const user = auth.currentUser;
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPostText, setNewPostText] = useState(post);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      if (photo) {
        const photoRef = ref(storage, `posts/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setShowOptions(false);
    }
  };

  const onEdit = () => {
    if (user?.uid !== userId) return;
    setShowEditModal(true);
    setShowOptions(false);
  };

  const handleSaveEdit = async () => {
    if (newPostText.trim() === "") return;
    const postRef = doc(db, "posts", id);
    try {
      await updateDoc(postRef, {
        post: newPostText.trim(),
      });
      setShowEditModal(false);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // 옵션 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node) && event.target !== moreButtonRef.current) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef, showOptions]);

  const moreButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Wrapper>
      <ImageContainer>
        {photo ? (
          <Photo src={photo} alt="post image" />
        ) : (
          <div>No Image</div>
        )}
      </ImageContainer>
      <TextContainer>
        <UserInfo>
          <Username>{username}</Username>
          <Payload>{post}</Payload>
        </UserInfo>
        {user?.uid === userId && (
          <MoreButton onClick={toggleOptions} ref={moreButtonRef}>
            ...
          </MoreButton>
        )}
      </TextContainer>
      {showOptions && user?.uid === userId && (
        <OptionsMenu ref={optionsRef}>
          <OptionButton onClick={onDelete}>삭제</OptionButton>
          <OptionButton onClick={onEdit}>수정</OptionButton>
        </OptionsMenu>
      )}
      {showEditModal && (
        <ModalOverlay>
          <ModalContent>
            <h4>글 수정</h4>
            <ModalTextarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
            <ModalButtons>
              <ModalButton onClick={() => setShowEditModal(false)}>취소</ModalButton>
              <ModalButton onClick={handleSaveEdit}>저장</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}