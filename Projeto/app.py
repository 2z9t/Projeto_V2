import os

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def landing():
    return render_template("landing.html")


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    app.run(debug=debug, port=int(os.environ.get("PORT", 5000)))
