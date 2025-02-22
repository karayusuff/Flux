from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return jsonify({'users': [user.to_dict() for user in users]})

@user_routes.route('/recent')
def recent_users():
    """
    Query for the 5 most recent users and returns them
    """
    users = User.query.order_by(User.created_at.desc()).limit(5).all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<string:username>')
@login_required
def user_by_username(username):
    """
    Query for a user by username and returns that user in a dictionary
    """
    user = User.query.filter_by(username=username).first()
    return user.to_dict()

@user_routes.route('/others')
@login_required
def other_users():

    users = User.query.all()

    users_data = []

    for user in users:

        users_data.append(
            {
                "id": user.id,
                "email": user.email,
                "username": user.username

            }
        )

    return jsonify({"Users": users_data}), 200

