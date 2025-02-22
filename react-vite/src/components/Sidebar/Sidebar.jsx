import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { thunkLoadFollows } from '../../redux/follows';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import FollowModal from '../FollowModal/FollowModal';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Sidebar.css';

function Sidebar() {
  const [newUsers, setNewUsers] = useState([]);
  const user = useSelector((state) => state.session.user);
  const follows = useSelector((state) => state.follows);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModal();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users/recent');
      const data = await response.json();
      setNewUsers(data.users);
    };
    fetchUsers();

    dispatch(thunkLoadFollows());
  }, [dispatch, closeModal]);

  return (
    <section id="sidebar">
      {user && (
        <OpenModalButton
          modalComponent={<CreatePostModal />}
          buttonText="Create New Post"
        />
      )}
      <div id="users-list">
        <h3>New Users</h3>
        <ul>
          {newUsers.map((newUser) => {
            const follow_modal = () => {setModalContent(
              <FollowModal
                userId={newUser.id}
                isFollowing={isFollowing}
                followId={followId}
                existingNote={followNote}
              />
            )}
            if (user && newUser.id === user.id) {
              return (
                <li
                  key={newUser.id}
                  onClick={() => navigate("/profile")}
                  style={{ cursor: "pointer" }}
                >
                  {newUser.username}
                </li>
              );
            }

            if (!user) {
              return (
                <li
                  key={newUser.id}
                  onClick={() =>
                    setModalContent(
                      <div id='signup_message'>
                        <LoginFormModal />
                        <p>
                          Don&apos;t have an account yet?{" "}
                          <span
                            onClick={() => setModalContent(<SignupFormModal />)}
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                              color: "#46976A",
                            }}
                          >
                            Sign up here!
                          </span>
                        </p>
                      </div>
                    )
                  }
                >
                  {newUser.username}
                </li>
              );
            }

            const follow = follows[newUser.id] || {};
            const isFollowing = !!follow.id;
            const followId = follow.id || null;
            const followNote = follow.note || "";

            return (
              <li
                key={newUser.id}
                // onClick={() =>
                //   setModalContent(
                //     <FollowModal
                //       userId={newUser.id}
                //       isFollowing={isFollowing}
                //       followId={followId}
                //       existingNote={followNote}
                //     />
                //   )
                // }
              >
                <div id='user_follow_div'> <div id='new_user' onClick={() => navigate(`/${newUser.username}`)}>{newUser.username}</div>
                <span className='follow_text' onClick={() => follow_modal()}>
                  {isFollowing ? "Following" : "Follow"}
                </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Sidebar;
