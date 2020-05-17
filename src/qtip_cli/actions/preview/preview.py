from flask import Flask, render_template, Response, request
import webbrowser
import logging
import os
import sys
import time
from qtip_cli.actions.upload_and_serve_file import upload_and_serve_file

from qtip_cli.helpers.args import get_file_to_upload, get_path_to_host
from qtip_cli.helpers.env import get_server_path

public_folder = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../public')
cli_folder = os.path.join(os.path.dirname(os.path.realpath(__file__)))

app = Flask(__name__,
    template_folder=cli_folder,
    static_url_path='',
    static_folder=public_folder,
)

os.environ['WERKZEUG_RUN_MAIN'] = 'true'
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


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


@app.route('/publish', methods=['POST'])
def publish():
    response = Response()
    response.headers.add('Access-Control-Allow-Origin', '*')

    if request.method != 'POST':
        return response

    try:
        upload_and_serve_file(True)
    except:
        response.status_code = 400
        return response

    response.status_code = 200
    return response

@app.route('/content')
def stream():
    response = Response(watch_file(),
                        mimetype="text/event-stream",
                        )

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/')
def home():
    return render_template('preview.html', nav=get_path_to_host().split('/'))



def init_preview():
    url = 'http://localhost:5002'

    if "--live" in sys.argv:
        url = get_server_path() + get_path_to_host() + '?preview=1'

    print(f'You can edit your page on the following {url}')

    webbrowser.open(url)
    app.run(port=5002, threaded=True)
