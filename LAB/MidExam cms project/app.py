from flask import Flask, render_template, request, redirect, url_for
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import datetime

app = Flask(__name__)


# -------------------------------
# MongoDB Connection
# -------------------------------

client = MongoClient("mongodb://127.0.0.1:27017")

database = client["cms_lab"]

posts_collection = database["posts"]


# -------------------------------
# Display All Posts
# -------------------------------

@app.route("/")
@app.route("/posts")
def show_posts():

    posts = list(
        posts_collection
        .find({}, {"content": 0})
        .sort("createdAt", -1)
    )

    return render_template("posts.html", posts=posts)


# -------------------------------
# Display Create Post Form
# -------------------------------

@app.route("/posts/new")
def new_post():

    return render_template("new-post.html")


# -------------------------------
# Create New Post
# -------------------------------

@app.route("/posts", methods=["POST"])
def create_post():

    title = request.form.get("title", "").strip()
    content = request.form.get("content", "").strip()
    author = request.form.get("author", "").strip()

    # Server-side validation
    if not title or not content or not author:

        error = "Title, content and author are required."

        return render_template(
            "new-post.html",
            error=error,
            title=title,
            content=content,
            author=author
        )

    # Create post document
    post = {
        "title": title,
        "content": content,
        "author": author,
        "createdAt": datetime.now()
    }

    # Insert post into MongoDB
    posts_collection.insert_one(post)

    # Redirect to post list
    return redirect(url_for("show_posts"))


# -------------------------------
# Display Individual Post
# -------------------------------

@app.route("/posts/<post_id>")
def show_post(post_id):

    try:
        post = posts_collection.find_one({
            "_id": ObjectId(post_id)
        })

    except InvalidId:
        return "Invalid post ID", 400

    if post is None:
        return "Post not found", 404

    return render_template("post.html", post=post)


# -------------------------------
# Run Flask Application
# -------------------------------

if __name__ == "__main__":
    app.run(debug=True)