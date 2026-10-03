from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "backend server is running"

@app.route("/details")
def details():
    data = {
        "name": "Aayushi",
        "batch": "5",
        "sap": "590012595"
    }
    return data

if __name__ == "__main__":
    app.run(debug=True)