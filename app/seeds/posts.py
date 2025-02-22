from app.models import db, Post, environment, SCHEMA
from sqlalchemy.sql import text


def seed_posts():
    seed_data = [
        Post(
            user_id=1,
            image="https://a0.muscache.com/im/ml/photo_enhancement/pictures/miso/Hosting-959493006014888753/original/6e4e417f-25e3-4578-941e-42fdd68a3971.jpeg?im_w=1200&im_format=avif",
            title="Sunset View",
            description="A beautiful sunset over the mountains."
        ),
        Post(
            user_id=2,
            image='https://a0.muscache.com/im/pictures/5832b7e2-5611-4f62-aa8e-a3d1e1362773.jpg?im_w=720&im_format=avif',
            description="The city shines bright at night."
        ),
        Post(
            user_id=3,
            image='https://a0.muscache.com/im/pictures/bd581ed1-f910-47e3-aa8b-197328b3ae08.jpg?im_w=720&im_format=avif',
            title="Forest Trail",
            description="An adventurous trail through the dense forest."
        ),
        Post(
            user_id=4,
            image='https://a0.muscache.com/im/pictures/5a9f61f2-0f93-4290-ab7d-e6bb5635ef2e.jpg?im_w=720&im_format=avif',
            title="Ocean Breeze",
            description="Feel the calmness of the ocean."
        ),
        Post(
            user_id=5,
            image='https://a0.muscache.com/im/pictures/186de821-eafa-4d91-affb-6b3d92d5d016.jpg?im_w=720&im_format=avif',
            title="Winter Wonderland",
            description="A serene winter landscape."
        ),
        Post(
            user_id=1,
            image='https://a0.muscache.com/im/pictures/c7eb5b9b-f7f2-46ff-9290-e5c386e3ca0f.jpg?im_w=720&im_format=avif',
            title="Autumn Leaves",
            description="The colors of autumn captured perfectly."
        ),
        Post(
            user_id=2,
            image='https://a0.muscache.com/im/pictures/c7eb5b9b-f7f2-46ff-9290-e5c386e3ca0f.jpg?im_w=720&im_format=avif',
            description="Golden sands as far as the eye can see."
        ),
        Post(
            user_id=3,
            image='https://a0.muscache.com/im/pictures/c6aaac6c-87b1-4d90-914c-2f1cb539a4b2.jpg?im_w=720&im_format=avif',
            description="The majesty of towering mountain peaks."
        ),
        Post(
            user_id=4,
            image='https://a0.muscache.com/im/pictures/3199a143-52a1-4f4d-bef1-aabd9ac98fde.jpg?im_w=720&im_format=avif',
            title="Spring Blooms",
            description="Flowers blossoming under the spring sun."
        ),
        Post(
            user_id=5,
            image='https://a0.muscache.com/im/pictures/prohost-api/Hosting-1034816792814888205/original/5b2ff94e-4b39-4494-9973-8efdb2b12e6e.jpeg?im_w=720&im_format=avif',
            title="Night Sky",
            description="A starry night to marvel at."
        )
    ]

    db.session.bulk_save_objects(seed_data)
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))
        
    db.session.commit()
