from flask import Flask, render_template, Response
import webbrowser
import logging
import os
import sys
import time
import threading
from threading import Lock

public_folder = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public')
cli_folder = os.path.join(os.path.dirname(os.path.realpath(__file__)))

app = Flask(__name__,
            template_folder=cli_folder,
            static_url_path='',
            static_folder=public_folder,

)

os.environ['WERKZEUG_RUN_MAIN'] = 'true'
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


def get_file_to_upload():
    arg_file_path = sys.argv[2]

    return os.path.join(os.getcwd(), arg_file_path)

def watch_file():
    file = get_file_to_upload()
    # global file_content
    print(f'Watching file {file}')
    while True:
        with open(file, 'r') as file_data:
            # with data_lock:
            file_content = file_data.read()
            yield 'data: %s\n\n' % file_content.replace('\n', '|n')
            time.sleep(1)


@app.route('/content')
def stream():
    return Response(watch_file(),
          mimetype="text/event-stream")

@app.route('/')
def home():
    return render_template('preview.html')


def init_preview():
    url = 'http://localhost:5002'
    print(f'You can edit your page on the following {url}')
    webbrowser.open(url)

    # watch_file_thread = threading.Thread(target=watch_file)
    # watch_file_thread.start()

    app.run(port=5002, threaded=True)
