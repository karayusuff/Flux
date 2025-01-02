import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import './PostPage.css';

function PostPage() {
    const [post, setPost] = useState([]);
    const [errors, setErrors] = useState();
    const [fillHeart, setFillHeart] = useState('');
    const navigate = useNavigate();
    const post_id_object = useParams()
    const post_id = post_id_object.post_id
    const sessionUser = useSelector((state) => state.session.user)

    useEffect(() => {
        fetch(`/api/posts/${post_id}`)
        .then((res) => res.json())
        .then((data) => setPost(data))
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) {
                setErrors(data.errors);
                console.log(errors)
            }
        })
    }, []);

    const fill_heart = (postId) => {
        setFillHeart(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }))
    }

    const heart = (postId) => fillHeart[postId] ? <FaHeart /> : <FaRegHeart />

    return (
        <div className='post_section'>
            <section className='post_section_2'>
                <picture onClick={() => navigate(`/posts/${post.id}`)} key={post.id} className='post_picture'>
                    <img src={post.image} alt={post.description} className='post_img' />
                    <div className='added_info_container'>
                    <div className='post_description'>{post.description}</div>
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
            </section>
        </div>
    )
}

export default PostPage