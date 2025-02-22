import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkLogout } from "../../redux/session";
import { useModal } from "../../context/Modal";
// import OpenModalButton from "../OpenModalButton/OpenModalButton"
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal"
import { ImHome } from "react-icons/im";
import { AiFillLike } from "react-icons/ai";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { FaComment } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { SiFlux } from "react-icons/si";
import logo from '../../../../images/flux-high-resolution-logo.png';
import "./Navigation.css";

function Navigation() {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();

  const handleLogout = () => {
    dispatch(thunkLogout());
    navigate('/')
  };

  return (
    <nav id="nav-bar">
      <img onClick={() => navigate('/')} src={logo} alt="Flux Logo" className="flux-logo" title="Ideas flow, connections grow!"/> 
      <ul>
        {!user ? (
          <>
            <li onClick={() => setModalContent(<LoginFormModal />)}><IoLogIn /> &nbsp; Log In</li>
            <li onClick={() => setModalContent(<SignupFormModal />)}><SiFlux /> &nbsp; Sign Up</li>
          </>
        ) : (
          <>
            <li onClick={() => navigate("/")}><ImHome /> &nbsp; Home</li>
            <li onClick={() => navigate("/profile")}><RiAccountPinCircleFill /> &nbsp; Profile</li>
            <li onClick={() => navigate("/likes")}><AiFillLike /> &nbsp; Likes</li>
            <li onClick={() => navigate("/comments")}><FaComment /> &nbsp; Comments</li>
            <li onClick={() => navigate("/following-users")}><RiUserFollowFill /> &nbsp; Following</li>
            <li onClick={handleLogout}><IoLogOut /> &nbsp; Log Out</li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
