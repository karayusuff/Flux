from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Follow, User, db
from app.forms import FollowForm

follow_routes = Blueprint('follows', __name__)

@follow_routes.route('/<int:id>', methods=['POST'])
@login_required
def create_follow(id):
    """
    Creates a follow
    """
    followed_user = User.query.get(id)
    if not followed_user:
        return jsonify({"message": "User not found"}), 404

    form = FollowForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        follow = Follow(
            follower_id=current_user.id,
            following_id=id,
            note=form.data['note']
        )
        db.session.add(follow)
        db.session.commit()
        return jsonify(follow.to_dict()), 201
    
    return jsonify({"message": "Authentication required"}), 401


@follow_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_follow(id):
    """
    Deletes a follow
    """
    followed_user = User.query.get(id)
    if not followed_user:
        return jsonify({"message": "User not found"}), 404
    
    follow = Follow.query.filter_by(follower_id=current_user.id, following_id=id).first()
    db.session.delete(follow)
    db.session.commit()

    return jsonify({"message": "Successfully unfollowed the user"}), 200


@follow_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_follow(id):
    """
    Updates a follow note
    """
    followed_user = User.query.get(id)
    if not followed_user:
        return jsonify({"message": "User not found"}), 404
    
    follow = Follow.query.filter_by(follower_id=current_user.id, following_id=id).first()
    if not follow:
        return jsonify({"message": "Follow relationship not found"}), 404
    
    data = request.get_json()
    follow.note = data['note']
    db.session.commit()

    return jsonify(follow.to_dict()), 200


@follow_routes.route('/', methods=['GET'])
@login_required
def get_following():
    """
    Returns a list of users that the current user is following
    """
    follows = Follow.query.filter_by(follower_id=current_user.id).all()
    return {'follows': [follow.to_dict() for follow in follows]}
