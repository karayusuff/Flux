from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import Length


class FollowForm(FlaskForm):
    note = StringField('note', validators=[Length(max=255)])