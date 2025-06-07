import { useParams, Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useGetCurrentUser, useGetUserPosts } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface StatBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");

  const { data: currentUser } = useGetCurrentUser();
  const { data: userPosts, isLoading: isLoadingUserPosts } = useGetUserPosts(id);

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const isCurrentUser = user.id === id;

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={userPosts?.documents?.length || 0} label="Posts" />
              <StatBlock value={currentUser.following?.length || 0} label="Following" />
              <StatBlock value={currentUser.followers?.length || 0} label="Followers" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {isCurrentUser ? (
              <div className="flex gap-4">
                <Link
                  to="/update-profile"
                  className="flex-center gap-2 rounded-lg bg-dark-4 px-5 py-2.5">
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                  />
                  <p className="flex whitespace-nowrap small-medium">
                    Edit Profile
                  </p>
                </Link>
              </div>
            ) : (
              <Button 
                type="button" 
                className="shad-button_primary px-8"
                onClick={() => {}}>
                Follow
              </Button>
            )}
          </div>
        </div>
      </div>

      {isCurrentUser && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              activeTab === "posts" && "!bg-dark-3"
            }`}
            onClick={() => setActiveTab("posts")}>
            <img
              src="/assets/icons/posts.svg"
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked`}
            className={`profile-tab rounded-r-lg ${
              activeTab === "liked" && "!bg-dark-3"
            }`}
            onClick={() => setActiveTab("liked")}>
            <img
              src="/assets/icons/like.svg"
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      {activeTab === "posts" && (
        <>
          {isLoadingUserPosts || !userPosts ? (
            <Loader />
          ) : (
            <ul className="w-full flex justify-center max-w-5xl gap-9">
              {userPosts.documents.length === 0 ? (
                <p className="text-light-4">No posts yet</p>
              ) : (
                <GridPostList 
                  posts={userPosts.documents} 
                  showUser={false} 
                />
              )}
            </ul>
          )}
        </>
      )}

      {activeTab === "liked" && isCurrentUser && (
        <div className="w-full flex justify-center max-w-5xl gap-9">
          {currentUser.liked?.length === 0 ? (
            <p className="text-light-4">No liked posts</p>
          ) : (
            <GridPostList 
              posts={currentUser.liked || []} 
              showUser={false} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;