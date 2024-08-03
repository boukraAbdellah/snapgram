import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";

const PostStats = ({
  post,
  userId,
}: {
  post: Models.Document;
  userId: string;
}) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  

  const [likes, setLikes] = useState(likesList);

  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();
  
    const savedPostRecord = currentUser?.save.find(
      (record: Models.Document) => record.post.$id === post.$id
  );
  console.log('savedRecord ')
  console.log(savedPostRecord)

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    let likesArray: string[] = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }
    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
      e.stopPropagation();
    
    

      if (savedPostRecord) {
          setIsSaved(false);
          deleteSavedPost(savedPostRecord.$id)
      } else {
          savePost({ postId: post.$id, userId: userId });
          setIsSaved(true);
      }
  };

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);


  return (
    <div className=" flex-between z-20">
      <div className=" flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className=" small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className=" flex gap-2 mr-5">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="save"
          width={20}
          height={20}
          onClick={handleSavePost}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PostStats;
