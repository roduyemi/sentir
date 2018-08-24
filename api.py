import sys, flask, logging
from textblob import TextBlob
from flask import request, jsonify

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

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