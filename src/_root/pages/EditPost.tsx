import PostForm from '@/components/Forms/PostForm';
import Loader from '@/components/shared/Loader';
import { useGetPostById } from '@/lib/react-query/queriesAndMutations';
import { useParams } from 'react-router-dom';

const EditPost = () => {
   const { id } = useParams();
   const { data: post, isLoading } = useGetPostById(id);

   if (isLoading)
     return (
       <div className="flex-center w-full h-full">
         <Loader />
       </div>
     );
  return (
    <div className=" flex flex-1 ">
      <div className="flex flex-col flex-1 gap-10 items-center overflow-scroll custom-scrollbar py-10 px-5 md:px-8 lg:p-14 ">
        <div className=" flex-start w-full max-w-5xl justify-start gap-3 ">
          <img
            src="\assets\icons\add-post.svg"
            alt="add post icon"
            width={36}
            height={36}
          />
          <h2 className=" h3-bold md:h2-bold text-left w-full">Update Post</h2>
        </div>
        <PostForm action="update" post={post}  />
      </div>
    </div>
  );
}

export default EditPost