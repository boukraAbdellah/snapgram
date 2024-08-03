import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";

type PostFormProps = {
  post?: Models.Document;
  action: 'create' | 'update';
}

const PostForm = ({ post,action }: PostFormProps) => {
  const navigate = useNavigate()
  const {user} = useUserContext()

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
        caption: post ? post?.caption : '',
        file: [],
        location: post? post?.location : "",
        tags: post ? post.tags.join(', ') : ''
    },
  });

  const {mutateAsync: updatePost,isPending:isUpdatingPost} = useUpdatePost()
  const { mutateAsync: createPost, isPending: isCreatingPost } = useCreatePost()
  
  //  const handleDeletePost = (
  //   e: React.MouseEvent<HTMLImageElement, MouseEvent>
  // ) => {
  //   e.stopPropagation();
  //   const deletedPost = await deletePost(post.$id) 

  // }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
   
    if (post && action === 'update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      })
      if (!updatedPost) {
        toast({
          title: "Updating post failed please try again",
        });
      }
      return navigate('/')
    }

    // action = create

    const newPost = await createPost({...values,userId: user.id})
   if (!newPost) toast({
     title: 'creating post failed please try again'
   })
    navigate('/')
    
  }
  
  

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-9 w-full max-w-5xl"
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" shad-form_label">Caption</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="shadcn"
                    {...field}
                    className=" shad-textarea custom-scrollbar"
                  />
                </FormControl>
                <FormMessage className=" shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl}
                  />
                </FormControl>
                <FormMessage className=" shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" shad-form_label">Add Location</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className=" shad-input" />
                </FormControl>
                <FormMessage className=" shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" shad-form_label">
                  Add Tags (seperated by commas " , ")
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Art, Expression, Learn"
                    {...field}
                    className=" shad-input"
                  />
                </FormControl>
                <FormMessage className=" shad-form_message" />
              </FormItem>
            )}
          />
          <div className=" flex gap-4 items-center justify-end">
            <Button type="button" className=" shad-button_dark_4" onClick={() => navigate(-1)}>
              {" "}
              Cancel
            </Button>
            <Button type="submit" className=" shad-button_primary">
              {isCreatingPost || isUpdatingPost ? <Loader /> : `${action} Post`}
            </Button>
          
          </div>
        </form>
      </Form>
    );
};

export default PostForm;
