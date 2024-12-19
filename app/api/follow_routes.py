from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Follow, User, db
from app.forms import FollowForm

follow_routes = Blueprint('follows', __name__)

@follow_routes.route('/follows/<int:user_id>', methods=['POST'])
@login_required
def create_follow(user_id):
    """
    Creates a follow
    """
    followed_user = User.query.get(user_id)
    if not followed_user:
        return jsonify({"message": "User not found"}), 404

    form = FollowForm()
    if form.validate_on_submit():
        follow = Follow(
            userId=current_user.id,
            followingId=user_id,
            text=form.text.data
        )
        db.session.add(follow)
        db.session.commit()
        return jsonify(follow.to_dict()), 201
    return jsonify({"message": "Authentication required"}), 401


@follow_routes.route('/follows/<int:user_id>', methods=['DELETE'])
@login_required
def delete_follow(user_id):
    """
    Deletes a follow
    """
    followed_user = User.query.get(user_id)
    if not followed_user:
        return jsonify({"message": "User not found"}), 404
    
    follow = Follow.query.filter_by(userId=current_user.id, followingId=user_id).first()
    db.session.delete(follow)
    db.session.commit()

    return jsonify({"message": "Successfully unfollowed the user"}), 200


@follow_routes.route('/follows/<int:user_id>', methods=['PUT'])
@login_required
def update_follow(user_id):
    """
    Updates a follow text
    """
    followed_user = User.query.get(user_id)
    if not followed_user:
        return jsonify({"message": "User not found"}), 404
    
    follow = Follow.query.filter_by(userId=current_user.id, followingId=user_id).first()
    if not follow:
        return jsonify({"message": "Follow relationship not found"}), 404
    
    data = request.get_json()
    follow.text = data['text']
    db.session.commit()

    return jsonify(follow.to_dict()), 200


@follow_routes.route('/follows', methods=['GET'])
@login_required
def get_following():
    """
    Returns a list of users that the current user is following.
    """
    follows = Follow.query.filter_by(userId=current_user.id).all()
    return {'follows': [follow.todict() for follow in follows]}
