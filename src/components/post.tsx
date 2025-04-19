import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { IPost } from "./timeline";
import styled from "styled-components";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

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
  border: 1px solid #e0e0e0;
  background-color: white;
  margin-bottom: 15px;
  max-height: 600px; /* 포스트의 최대 높이 제한 (조정 가능) */
  overflow: hidden; /* 내용이 최대 높이를 넘어가면 숨김 */
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  padding: 10px 15px;
`;

const Username = styled.span`
  font-weight: bold;
  font-size: 14px; /* 폰트 크기 줄임 */
  margin-right: 8px;
`;

const Payload = styled.p`
  font-size: 12px; /* 폰트 크기 줄임 */
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 5px;
`;

const DeleteBtn = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
`;

const EditBtn = styled.button`
  background-color: #bebebe;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
`;

export default function Post({ username, photo, post, userId, id }: IPost) {
  const user = auth.currentUser;
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPostText, setNewPostText] = useState(post);
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this post?");

    if(!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "posts", id)); //firebase db에서 - posts 컬랙션의 doc, id 를 받음
      if(photo){
        const photoRef = ref(storage, `posts/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch(e) {
      console.log(e)
    } finally {
      //
    }
  }

  const onEdit = () => {
    if (user?.uid !== userId) return;
    setShowEditModal(true);
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
  
  return (
    <Wrapper>
      {photo && (
        <ImageContainer>
          <Photo src={photo} alt="post image" />
        </ImageContainer>
      )}
      <TextContainer>
        <Username>{username}</Username>
        <Payload>{post}</Payload>
        {user?.uid === userId ? <DeleteBtn onClick={onDelete}>🗑️</DeleteBtn> : null}
        {user?.uid === userId ? <EditBtn onClick={onEdit}>✏️</EditBtn> : null}
      </TextContainer>
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