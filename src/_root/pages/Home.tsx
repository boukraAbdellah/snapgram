import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending: isLoadingPosts } = useGetRecentPosts()
  if (!posts) console.log('there is no posts right now')
  return (
    <div className="flex flex-1">
      <div className=" flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className=" home-posts">
          <h2 className=" h3-bold md:h2-bold text-left w-full">Home Feeds</h2>
          {isLoadingPosts && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => {
                return <PostCard key={post.$id} post={post} />;
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home