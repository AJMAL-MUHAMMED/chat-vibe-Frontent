import { Link } from "react-router-dom"

export default function LeftLink({ img, text, notification }) {
  return (
    <Link to={img === 'messenger' ? "/chat" : img === 'friends' ? '/friends' : "/"}>
      <div className="left_link hover1">
        <img src={`../../../left/${img}.png`} alt="" />
        {notification !== undefined ? (
          <div className="col">
            <div className="col_1">{text}</div>
            <div className="col_2">{notification}</div>
          </div>
        ) : (
          <span>{text}</span>
        )}
      </div>
    </Link>
  );
}
