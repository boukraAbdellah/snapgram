import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.DocumentList<Models.Document> | undefined;
};

export const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};