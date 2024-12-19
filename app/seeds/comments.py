from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text


def seed_comments():
    # Example seed data
    comment1 = Comment(
        text="This is such a great post! Thanks for sharing.",
        user_id=1,  # Assuming user with ID 1 exists
        post_id=1,  # Assuming post with ID 1 exists
    )
    comment2 = Comment(
        text="That looks amazing!",
        user_id=2,  # Assuming user with ID 2 exists
        post_id=1,  # Assuming post with ID 1 exists
    )
    comment3 = Comment(
        text="Could you elaborate more on this topic?",
        user_id=3,  # Assuming user with ID 3 exists
        post_id=2,  # Assuming post with ID 2 exists
    )
    comment4 = Comment(
        text="This is very insightful, thank you!",
        user_id=1,  # Assuming user with ID 1 exists
        post_id=3,  # Assuming post with ID 3 exists
    )

    # Add all comments to the session
    db.session.add_all([comment1, comment2, comment3, comment4])
    db.session.commit()


def undo_comments():
    if environment == "production":
        db.session.execute(
            text(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
        )
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()
