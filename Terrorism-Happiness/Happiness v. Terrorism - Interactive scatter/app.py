from flask import Flask, jsonify, render_template

app = Flask(__name__)

#@app.route("/")
# def index():
#     """Return the homepage."""
#     return render_template("index.html", text="")

# @app.route("/decades/<decade>")
# def decade(decade):
#     """Stroll through the decades."""
#     print("-----------------")
#     print("index"+decade+".html")
#     return render_template("index"+decade+".html", text="")

# @app.route("/history")
# def history():
#     """Return the terrorism history chart."""
#     return render_template("history.html", text="")

@app.route("/")
def trends():
    return render_template("index.html", text="")
    
if __name__ == "__main__":
    app.run()
