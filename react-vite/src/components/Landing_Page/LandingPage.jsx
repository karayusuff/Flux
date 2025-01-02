import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import './LandingPage.css';
function LandingPage() {
    const [posts, setPosts] = useState([]);
    const [sessionPosts, setSessionPosts] = useState([])
    const [users, setUsers] = useState();
    const [errors, setErrors] = useState();
    const [view, setView] = useState('all');
    const [fillHeart, setFillHeart] = useState('');
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user)

    useEffect(() => {
        fetch('/api/posts')
        .then((res) => res.json())
        .then((data) => setPosts(data.Posts))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })
    }, [errors]);

    useEffect(() => {
        fetch('/api/posts/followed_posts')
        .then((res) => res.json())
        .then((data) => setSessionPosts(data.Posts))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })
    }, [sessionUser, errors]);
    
    useEffect(() => {
        fetch('/api/users/others')
        .then((res) => res.json())
        .then((data) => setUsers(data.Users))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })
    }, [sessionUser, errors]); 
    
    const switchView = (viewType) => {
        setView(viewType)
    }

    const fill_heart = (postId) => {
        setFillHeart(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }))
    }

    const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />

    const display = sessionUser ? (view === "all" ? posts : sessionPosts) : posts;

    return (
        <div className='posts_section'>
            <section className='posts_section_2'>
                {sessionUser && (
                    <div className='landing_page_button_container'>
                    <div className='landing_page_button'
                    onClick={() => switchView('all')}>All Posts</div>
                    <div className='landing_page_button'
                    onClick={() => switchView('following')}>Following</div>
                    </div>                    
                )}
                {display.reverse().map((post) => {
                    const handleClick = () => {
                        if(sessionUser && sessionUser.id === post.id) {
                            navigate(`/posts/${post.id}`)
                        } else if(sessionUser && sessionUser.id !== post.id) {
                            navigate('/')
                        } else navigate('/signup')
                    }
                    const handleUser = () => {
                      const user = users?.find((user) => user.id === post.user_id);
                      if(user && user.id !== sessionUser.id) {
                        return user.username
                      }
                    }

                    const isFollowing = sessionPosts.some((sessionPost) => sessionPost.id === post.id);

                    return (
                        <picture key={post.id} className='post_container'>
                            <div className='user_info'>{handleUser()} {sessionUser && sessionUser.id !== post.user_id  && !isFollowing && (<div className='follow_text'>Follow</div>)}</div>
                            <img src={post.image} alt={post.description} className='posts_img' onClick={handleClick} />
                            <div className='added_info_div'>
                            <div className='description'>{post.description}</div>
                            <div className='likes_container'> 
                            <div className='heart_icon' onClick={() => fill_heart(post.id)}>{heart(post.id)}</div>
                            <div className='likes_count'>{post.likes}</div>
                            </div>
                            <div className='comment_container'>
                            <div className='comment_icon'><FaRegCommentDots /></div>
                            <div className='comment_count'>{post.comment_count}</div>
                            </div>
                            </div>
                        </picture>
                    );
                })
              }
            </section>
        </div>
    )
}
export default LandingPage