import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import { profileReducer } from "../../functions/reducers";
import './style.css'
import Cover from "./Cover";
import ProfilePictureInfos from "./ProfilePictureInfos";
import ProfileMenu from "./ProfileMenu";
import CreatePost from '../../components/createPost'
import GridPosts from "./GridPost";
import Post from '../../components/post';
import Photos from "./Photos";
import Friends from "./Friends";
import CreatePostPopup from "../../components/createPostPopup";

export default function Profile({ getAllPosts }) {
  const [visible, setVisible] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const [photos, setPhotos] = useState([])
  var userName = username === undefined ? user.username : username;
  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: {},
    error: "",
  });
  useEffect(() => {
    getProfile();
  }, [userName]);
  var visitor = userName === user.username ? false : true;
  const path = `${userName}/*`;
  const max = 30;
  const sort = "desc";

  const getProfile = async () => {
    try {
      dispatch({
        type: "PROFILE_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (data.ok === false) {
        navigate("/profile");
      } else {
        try {
          const images = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/listImages`,
            { path, sort, max },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setPhotos(images.data);
        } catch (error) {
          console.log(error);
        }
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: data,
        });
      }
    } catch (error) {
      dispatch({
        type: "PROFILE_ERROR",
        payload: error.response.data.message,
      });
    }
  };
  return (
    <div className="profile">
      {visible &&
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={profile?.posts}
          dispatch={dispatch}
          profile
        />}
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="profile_top">
        <div className="profile_container">
          <Cover cover={profile.cover} visitor={visitor} />
          <ProfilePictureInfos profile={profile} visitor={visitor} photos={photos.resources} />
          <ProfileMenu />
          <div className="profile_grid">
            <div className="profile_left">
              <Photos username={userName} token={user.token} photos={photos} />
              <Friends friends={profile.friends}/>
            </div>
            <div className="profile_right">
              {visitor && (<CreatePost user={user} profile setVisible={setVisible} />)}
              {/* <GridPosts /> */}
              <div className="posts">
                {profile.posts && profile.posts.length ? (
                  profile.posts.map((post) => (
                    <Post post={post} user={user} key={post._id} profile />
                  ))
                ) : (
                  <div className="no_posts">No posts available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
}
