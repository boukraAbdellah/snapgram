import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
  try {
    // to create account in auth appwrite
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    // to save user document in database

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      imageUrl: avatarUrl,
    });
    console.log({ newUser });
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  username?: string;
  imageUrl: URL;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    console.log(currentAccount);

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Signout

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    // uplaod image to storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error("No uploaded file");

    // get file url
    const fileUrl = await getFilePreview(uploadedFile.$id);
    console.log(fileUrl);

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
    }

    // convert tags into array

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // createPost

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error("not new post");
    }
    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (err) {
    console.log(err);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    console.log(posts);
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    console.log("we are from api");
    console.log({ postId, userId });
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(saveRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      saveRecordId
    );

    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  try {
    const hasFileToUpdate = post.file.length > 0;
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      // Get new file Url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageId: uploadedFile.$id, imageUrl: fileUrl };
    }

    // convert tags to array

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    
    // if not update

    if (!updatedPost) {
      // delete the files recently added
      if (hasFileToUpdate) {
        await deleteFile(image.imageId)
      }
      throw Error;
    }

    if (hasFileToUpdate) {
      await deleteFile(post.imageId)
    }
    return updatedPost;
  } catch (err) {
    console.log(err);
  }
}
// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============ delete post

export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;
  try {
    const deletedPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    console.log(deletedPost)
    if (!deletedPost) throw Error;

    await deleteFile(imageId)
    return {status : 'ok'}
  } catch (error) {
    console.log(error)
  }
}

// ======== get user by id

export async function getUserById(userId?: string) {
  if (!userId) throw Error;

  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// ==== get user posts

export async function getUserPosts(userId: string) {
  if (!userId) return;
  try {
    const posts = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );
    if (!posts) throw Error;
    return posts
  } catch (error) {
    console.log(error)
  }
  

}


// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}