import "./style.css";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  Friends,
  FriendsActive,
  Gaming,
  Home,
  HomeActive,
  Market,
  Menu,
  Messenger,
  Notifications,
  Search,
  Watch,
} from "../../svg";
import { useSelector } from "react-redux";
import SearchMenu from "./SearchMenu";
import { useRef, useState } from "react";
import AllMenu from "./AllMenu";
import useClickOutside from "../../helpers/clickOutside";
import UserMenu from "./userMenu";
export default function Header({ page, getAllPosts }) {
  const { user } = useSelector((user) => ({ ...user }));
  const color = "#65676b";
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const allmenu = useRef(null);
  const usermenu = useRef(null);
  useClickOutside(allmenu, () => {
    setShowAllMenu(false);
  });
  useClickOutside(usermenu, () => {
    setShowUserMenu(false);
  });
  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <img className="logo" src="../../icons/logo.png" />
          </div>
        </Link>
        <div
          className="search search1"
          onClick={() => {
            setShowSearchMenu(true);
          }}
        >
          <Search color={color} />
          <input
            type="text"
            placeholder="Search Chatvibe"
            className="hide_input"
          />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu color={color} setShowSearchMenu={setShowSearchMenu} token={user.token} />
      )}
      <div className="header_middle">
        <Link to="/" className={`middle_icon ${page === 'home' ? "active" : "hover1"}`}
          onClick={() => getAllPosts()}
        >
          {
            page === "home" ? <HomeActive /> : <Home color={color} />
          }
        </Link>
        <Link to="/friends" className="middle_icon hover1">
          {page === "friends" ? <FriendsActive /> : <Friends color={color} />}
        </Link>
        <Link to="/chat" className="middle_icon hover1">
          <Messenger />
          {/* <div className="middle_notification">9+</div> */}
        </Link>
     
      </div>
      <div className="header_right">
        <Link to="/profile" className={`profile_link hover1 ${page === 'profile' ? "active_link" : ""}`}>
          <img src={user?.picture} alt="" />
          <span>{user?.first_name} {user?.last_name}</span>
        </Link>
        <div className="circle_icon hover1">
          <Link to='/chat'>
            <Messenger />
          </Link>
        </div>
        <div className="circle_icon hover1">
          <Notifications />
          <div className="right_notification">5</div>
        </div>
        <div
          className={`circle_icon hover1 ${showUserMenu && "active_header"}`}
          ref={usermenu}
        >
          <div
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <ArrowDown />
            </div>
          </div>

          {showUserMenu && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}
