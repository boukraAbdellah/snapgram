import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { Models } from "appwrite";
const PostCard = ({ post } : {post : Models.Document}) => {
  const { user } = useUserContext();
  return (
    <div className=" post-card">
      <div className=" flex-between">
        <div className=" flex items-center gap-3">
          <Link to={`/profile/${post.creator?.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className=" w-12 h-12 rounded-full "
            />
          </Link>
          <div className="flex flex-col ">
            <p className="base-medium text-light-1 lg:body-bold">
              {post.creator?.name}
            </p>
            <div className=" flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className=" py-5 small-medium lg:base-medium">
          <p>{post.caption}</p>
          <ul className=" flex gap-1 mt-2">
            {post.tags.map((tag: string, index:number) => (
              <li
                key={`${tag}${index}`}
                className=" text-light-3 small-regular"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className=" post-card_img"
        />
      </Link>
      <PostStats post={post} userId={ user.id} />
    </div>
  );
};

export default PostCard;
