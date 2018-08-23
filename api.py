import sys, flask
from textblob import TextBlob
from flask import request, jsonify

app = flask.Flask(__name__)
app.config["DEBUG"] = False


@app.route('/api/v1', methods=['GET'])
def home():
    status = TextBlob(request.args['tweet'])
    sentiment = {
        "sentiment": status.polarity, 
        "magnitude": status.subjectivity
    }
    return jsonify(sentiment)
app.run()