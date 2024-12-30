import { useEffect, useState } from "react";
import "./CommentsModal.css";

function CommentsModal({ postId }) {
    const [comments, setComments] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetch(`/api/posts/${postId}/comments`)
            .then((res) => res.json())
            .then((data) => setComments(data.comments))
            .catch((error) => {
                console.error('Error fetching comments', error);
            });
    }, [postId]); 

    const displayedComments = showAllComments ? comments : comments.slice(0, 4);

    const createComment = () => {
        if (!newComment.trim()) {
            alert("Please enter a comment.");
            return;
        }

        const payload = { comment: newComment };

        fetch(`/api/posts/${postId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error creating comment:", data.error);
                    return;
                }
                setComments((prevComments) => [data, ...prevComments]);
                setNewComment("");
            })
            .catch((error) => {
                console.error("Error creating comment:", error);
            });
    };

    return (
        <div>
            <h3>Recent Comments</h3>
            <div className='comments'>
                <div className='comments_list'>
                    {displayedComments.map((comment) => {
                        return (
                            <div key={comment.id}>
                                <p>{comment.comment}</p>
                            </div>
                        );
                    })}

                    {!showAllComments && comments.length > 4 && (
                        <button onClick={() => setShowAllComments(true)}>
                            Show all comments
                        </button>
                    )}
                </div>

                <div className='create_comment'>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write here..."
                    />

                    <button onClick={createComment}>
                        Comment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommentsModal;