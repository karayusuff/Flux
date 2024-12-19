from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Comment, Post, db, User

comments_routes = Blueprint("comments", __name__)


# Get all comments_routes for a specific post
@comments_routes.route("/posts/<int:post_id>", methods=["GET"])
@login_required
def get_comments(post_id):
    comments = (
        Comment.query.filter_by(post_id=post_id)
        .order_by(Comment.created_at.desc())
        .all()
    )
    response = [
        {
            "id": comment.id,
            "text": comment.text,
            "user": {"id": comment.user.id, "username": comment.user.username},
            "created_at": comment.created_at,
        }
        for comment in comments
    ]
    return jsonify(response), 200


# Add a comment to a specific post
@comments_routes.route("/posts/<int:post_id>", methods=["POST"])
@login_required  # Require authentication
def create_comment(post_id):
    data = request.get_json()
    te = data.get("te")

    if not te:
        return {"error": "Content is required"}, 400

    post = Post.query.get(post_id)
    if not post:
        return {"error": "Post not found"}, 404

    new_comment = Comment(te=te, user_id=current_user.id, post_id=post_id)
    db.session.add(new_comment)
    db.session.commit()

    return new_comment.to_dict(), 201


@comments_routes.route("/<int:comment_id>", methods=["PUT"])
@login_required
def update_comment(comment_id):
    """
    Update an existing comment by its id
    """
    data = request.get_json()
    te = data.get("te")

    if not te:
        return {"error": "Content is required"}, 400

    comment = Comment.query.get(comment_id)
    if not comment:
        return {"error": "Comment not found"}, 404

    if comment.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    comment.te = te
    db.session.commit()

    return comment.to_dict(), 200


@comments_routes.route("/<int:comment_id>", methods=["DELETE"])
@login_required
def delete_comment(comment_id):
    """
    Delete a comment by its id
    """
    comment = Comment.query.get(comment_id)
    if not comment:
        return {"error": "Comment not found"}, 404

    if comment.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    db.session.delete(comment)
    db.session.commit()

    return {"message": "Comment deleted successfully"}, 200
