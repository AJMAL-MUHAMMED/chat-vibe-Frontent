import { useRef, useState } from "react";
import MenuItem from "./MenuItem";
import useOnClickOutside from "../../helpers/clickOutside";
import { deletePost } from "../../functions/post";
export default function PostMenu({
  postUserId,
  userId,
  imagesLength,
  setShowMenu,
  token,
  postId,
  postRef
}) {
  const [test, setTest] = useState(postUserId === userId ? true : false);
  const menu = useRef(null);
  useOnClickOutside(menu, () => setShowMenu(false));

  const deleteHandler = async () => {
    const res = await deletePost(postId, token);
    if (res.status === "ok") {
      postRef.current.remove();
    }
  };
  return (
    <ul className="post_menu" ref={menu}>
      {/* {test && <MenuItem icon="pin_icon" title="Pin Post" />} */}
      <MenuItem
        icon="save_icon"
        title="Save Post"
        subtitle="Add this to your saved items."
      />
      <div className="line"></div>
      {test && <MenuItem icon="edit_icon" title="Edit Post" />}
      {/* {!test && (
        <MenuItem
          icon="turnOnNotification_icon"
          title="Turn on notifications for this post"
        />
      )}
      {imagesLength && <MenuItem icon="download_icon" title="Download" />}
      {imagesLength && (
        <MenuItem icon="fullscreen_icon" title="Enter Fullscreen" />
      )}
      {test && <MenuItem img="../../../icons/lock.png" title="Edit audience" />}
      {test && (
        <MenuItem
          icon="turnOffNotifications_icon"
          title="Turn off notifications for this post"
        />
      )} */}
      {/* {test && <MenuItem icon="delete_icon" title="Turn off translations" />} */}
      {/* {test && <MenuItem icon="date_icon" title="Edit Date" />} */}
      {/* {test && (
        <MenuItem icon="refresh_icon" title="Refresh share attachment" />
      )} */}
      {/* {test && <MenuItem icon="archive_icon" title="Move to archive" />} */}
      <div onClick={() => deleteHandler()}>
        {test && (
          <MenuItem
            icon="trash_icon"
            title="Move to trash"
          />
        )}
      </div>
      {/* {!test && <div className="line"></div>}
      {!test && (
        <MenuItem
          img="../../../icons/report.png"
          title="Report post"
          subtitle="i'm concerned about this post"
        />
      )} */}
    </ul >
  );
}
