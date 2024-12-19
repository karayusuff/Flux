from flask_wtf import FlaskForm
from wtforms import StringField
from app.models import Follow


class FollowForm(FlaskForm):
    text = StringField('text')