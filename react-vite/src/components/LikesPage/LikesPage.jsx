import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaRegHeart, FaRegCommentDots, FaHeart } from "react-icons/fa";
import { thunkLoadLikes } from '../../redux/likes';
import { thunkLoadFollows } from '../../redux/follows';
import LikeModal from '../LikeModal/LikeModal';
import CommentsModal from '../CommentsModal/CommentsModal';
import FollowModal from '../FollowModal/FollowModal';
// import PostModal from '../PostModal/PostModal';
import { useModal } from '../../context/Modal';
import './LikesPage.css';

function LikesPage() {
    const [likes, setLikes] = useState([]);
    const [errors, setErrors] = useState();
    const [fillHeart, setFillHeart] = useState('');
    const { setModalContent, closeModal } = useModal();
    const [followStatus, setFollowStatus] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        fetch('/api/likes/current')
        .then((res) => res.json())
        .then((data) => setLikes(data.likes))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors);
            }
        });

        dispatch(thunkLoadFollows());    
        dispatch(thunkLoadLikes());
    }, [dispatch, errors]);

    const refreshLikes = async () => {
        fetch('/api/likes/current')
        .then((res) => res.json())
        .then((data) => setLikes(data.likes))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors);
            }
        });

        dispatch(thunkLoadFollows());    
        dispatch(thunkLoadLikes());
    };

    // const refreshPosts = async () => {
    //     fetch('/api/likes/current')
    //     .then((res) => res.json())
    //     .then((data) => setLikes(data.likes))
    //     .catch(async (res) => {
    //         const data = await res.json();
    //         if(data && data.errors) {
    //             setErrors(data.errors);
    //             console.log(errors);
    //         }
    //     });

    //     dispatch(thunkLoadFollows());    
    //     dispatch(thunkLoadLikes());
    // };

    const checkFollowStatus = async (username) => {
        try {
            const response = await fetch(`/api/follows/${username}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching follow status:", error);
            return { is_following: false, note: "" };
        }
    };

    useEffect(() => {
        const loadFollowStatus = async () => {
            const status = {};
            for (const like of likes) {
                const { is_following, note } = await checkFollowStatus(like.poster_username);
                status[like.poster_username] = { is_following, note };
            }
            setFollowStatus(status);
        };
        if (likes.length > 0) loadFollowStatus();
    }, [likes]);

    const fill_heart = (postId) => {
        setFillHeart(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />;

    const refreshFollows = async () => {
        const updatedFollowStatus = {};
        for (const like of likes) {
            const { is_following, note } = await checkFollowStatus(like.poster_username);
            updatedFollowStatus[like.poster_username] = { is_following, note };
        }
        setFollowStatus(updatedFollowStatus);
    };

    const openFollowModal = (like) => {
        const userFollowStatus = followStatus[like.poster_username] || { is_following: false, note: "" }; 
        setModalContent(
            <FollowModal 
                userId={like.poster_id} 
                isFollowing={userFollowStatus.is_following}
                existingNote={userFollowStatus.note} 
                refreshFollows={refreshFollows}
            />
        );
    };


    return (
        <div className='posts_section_4'>
            <section className='posts_section_3'>
            <div className='h1_container'><h1 id='h1'>Likes</h1></div>
                {likes.length === 0 ? (
                    <p id='no_posts'>You have not liked any posts.</p> 
                ) : (
                    [...likes].reverse().map((like) => {
                        const openLikesModal = () => {
                            setModalContent(<LikeModal postId={like.id} isLiked={true} likeId={like.id} existingNote={like.note} closeModal={closeModal} refreshLikes={refreshLikes}/> );
                        };

                        const openCommentModal = () => {
                            setModalContent(<CommentsModal postId={like.post_id} closeModal={closeModal}/> );
                        };

                        // const openPostModal = () => {
                        //     setModalContent(<PostModal postId={like.post_id} existingTitle={like.title} existingDescription={like.description} closeModal={closeModal} refreshPosts={refreshPosts} />)
                        //   }

                        const followButton = followStatus[like.poster_username]?.is_following ? "Following" : "Follow";

                        return (
                            <div key={like.post} className='post_container'>
                                <div className='user_info'>
                                    <a style={{paddingRight:'.8%'}} href={`/${like.poster_username}`} id='user_a_tag'>{like.poster_username}</a>
                                    <div id='follow_me' onClick={() => openFollowModal(like)}>{followButton}</div>
                                </div>
                                <img 
                                    onClick={() => navigate(`/posts/${like.post_id}`)} 
                                    src={like.image} 
                                    alt={like.description} 
                                    className='likes_img'
                                />
                                <div className='added_info_div'>
                                    <div className='description'>{like.description}</div>
                                    {/* {sessionUser && sessionUser.id === like.poster_id && (
                                        <div className='manage_like_container'>
                                        <div className='manage_like_icon' onClick={(e) => {e.stopPropagation();openPostModal()}}><FaCog /></div>
                                        </div>
                                    )} */}
                                    <div className='likes_container'>
                                        <div className='heart_icon' onClick={(e) => {e.stopPropagation(); fill_heart(like.id); openLikesModal()}}>{heart(like.id)}</div>
                                        <div className='likes_count'>{like.likes_count}</div>
                                    </div>
                                    <div className='note_container'>
                                        <div className='note_icon' onClick={(e) => {e.stopPropagation(); openCommentModal()}}><FaRegCommentDots /></div>
                                        <div className='note'>{like.note}</div>
                                    </div>
                                </div>     
                            </div>
                        );
                    })
                )}
            </section>
        </div>
    );
}

export default LikesPage;
