from flask import Flask, render_template, url_for

app = Flask(__name__)



@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/cadastrar')
def cadastrar():
    return render_template('cadastrar.html')

@app.route('/entrar')
def entrar():
    return render_template('entrar.html')



if __name__ == '__main__':
    app.run(debug=True)