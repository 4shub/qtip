#!/usr/bin/env python3
import sys
import os
import json
import urllib.request
import re
import base64
import requests

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

import itertools
import email.generator
import mimetypes
import urllib

# arg1 = action
# arg2 = path on website
# arg3 = file to upload
def get_action():
    return sys.argv[1]

def get_if_qtip_is_dev():
    env = os.environ.get('QTIP_ENV')

    if (env == 'development'):
        return True

    return False

def get_server_path():
    if (get_if_qtip_is_dev()):
        return 'http://localhost:4225'

    return os.environ['QTIP_SERVER']

def get_file_to_upload():
    arg_file_path = sys.argv[3]

    return os.path.join(os.getcwd(), arg_file_path)

def get_path_to_host():
    return sys.argv[2]

def get_auth_token_header():
    try:
        token = os.environ['QTIP_AUTH_TOKEN']
    except:
        raise NameError('QTIP_AUTH_TOKEN environment variable not set')

    return token



allowed_file_types = ['txt', 'md', 'json', 'js', 'tsx']

def upload_image(file_path):
    path = get_path_to_host()
    request_path = get_server_path() + '/___image'

    request_headers = {
        'X-AUTH-TOKEN': get_auth_token_header(),
    }

    url = request_path
    data = { 'path': path }

    files = {'file': open(file_path, 'rb')}
    r = requests.post(url, data=data, files=files, headers=request_headers)

def validate_file(file_name):
    obj = file_name.split('.')

    if len(obj) == 1:
        return

    if obj[-1] in allowed_file_types:
        return

    allowed_file_types_str = ', '.join(allowed_file_types)
    raise NameError(f'File is an invalid type. Allowed file extensions {allowed_file_types_str}')


def upload_and_serve_file():
    file_to_upload_path = get_file_to_upload()

    path = get_path_to_host()

    validate_file(file_to_upload_path)

    with open(file_to_upload_path, 'r') as content_file:
        content = content_file.read()

    image_details = []
    for imagePath in re.findall('(?:!\[.*?\]\(([^:]*?)\))', content):
        head, tail = os.path.split(imagePath)
        image_details.append({
            'originalPath': imagePath,
            'updatedAt': 0 #os.path.getmtime(imagePath)
        })


    payload = {"content": content, "imageDetails": image_details}

    request_params = json.dumps(payload).encode('utf8')
    request_headers = {'content-type': 'application/json', 'X-AUTH-TOKEN': get_auth_token_header()}
    request_path = get_server_path() + path

    request = urllib.request.Request(request_path, data=request_params,
                                 headers=request_headers)

    response = send_request(request)

    data = json.load(response)

    images_to_upload = data.get('imagesToUpload')

    if not images_to_upload or len(images_to_upload) == 0:
        print(f'This page is now served. It should be available on when public :\n{request_path}')
        sys.exit()

    # upload images
    for imagePath in images_to_upload:
        upload_image(imagePath)

def delete_file():
    path = get_path_to_host()
    request_path = get_server_path() + path

    request_headers = {'X-AUTH-TOKEN': get_auth_token_header()}
    request = urllib.request.Request(request_path, headers=request_headers)
    request.get_method = lambda: 'DELETE'
    send_request(request)

def invalid_action():
    print('Unknown action, type "qtip help" for more info')

def show_help():
    help_text = """
Here are the available actions for qtip:

    help - shows help text

    serve - uploads and serves a file
        Usage: qtip serve /file/path/on/server /path/to/file

    delete - removes a file from qtip server
        Usage: qtip remove /file/path/on/server
    """
    print(help_text)

# makes a file public to be viewed
def make_public():
    path = get_path_to_host()

    warning_text = f'{bcolors.FAIL}{bcolors.BOLD}You cannot make a project private again, you would need to delete the project to hide it.\n{bcolors.ENDC}'
    print(f'This will make the file `{path}` visible to everyone on the internet!\n\n{warning_text}')

    ans = input('Confirm making file public (y/n): ')

    if ans != 'y':
        print('Operation aborted')
        sys.exit()

    request_path = get_server_path() + path + '?method=make-public'

    request_headers = {'X-AUTH-TOKEN': get_auth_token_header()}
    request = urllib.request.Request(request_path, headers=request_headers)
    request.get_method = lambda: 'PUT'
    send_request(request)

def get_ip_list():
    ip_list_str = sys.argv[3]

    return ip_list_str.split(',')

def send_request(request):
    try:
        response = urllib.request.urlopen(request)

        return response
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'Error: {body}')
        sys.exit()

def restrict_ip():
    path = get_path_to_host()
    restricted_ip_list = get_ip_list()

    request_path = get_server_path() + path + '?method=restrict-ip'

    request_headers = {'X-AUTH-TOKEN': get_auth_token_header(), 'content-type': 'application/json'}
    payload = {"ipList": restricted_ip_list}
    request_params = json.dumps(payload).encode('utf8')

    request = urllib.request.Request(request_path, headers=request_headers, data=request_params)
    request.get_method = lambda: 'PUT'
    send_request(request)

def list_directory():
    path = get_path_to_host()
    request_path = get_server_path() + path + '?method=ls'

    request_headers = {'X-AUTH-TOKEN': get_auth_token_header()}
    request = urllib.request.Request(request_path, headers=request_headers)
    request.get_method = lambda: 'GET'

    response = send_request(request)

    data = json.load(response)

    for result in data.get('results'):
        if 'public' in result:
            print(f'{bcolors.FAIL}{result}{bcolors.ENDC}')
        elif 'restricted' in result:
            print(f'{bcolors.WARNING}{result}{bcolors.ENDC}')
        else:
            print(result)

def get_file_data():
    path = get_path_to_host()
    request_path = get_server_path() + path + '?method=cat'

    request_headers = {'X-AUTH-TOKEN': get_auth_token_header()}
    request = urllib.request.Request(request_path, headers=request_headers)
    request.get_method = lambda: 'GET'

    response = send_request(request)

    data = json.load(response)

    return data.get('results')

def view_file():
    data = get_file_data()
    print(data)

def get_save_file_dest():
    try:
        arg_file_path = sys.argv[3]

        return os.path.join(os.getcwd(), arg_file_path)
    except:
        raise NameError('No path to save file exists')

def get_file():
    save_to_dest = get_save_file_dest()

    data = get_file_data()

    with open(save_to_dest, 'w') as file:
        file.write(data)


def map_actions_to_operations():
    action_map = {
        'serve': upload_and_serve_file,
        'delete': delete_file,
        'help': show_help,
        'public': make_public,
        'restrictip': restrict_ip,
        'ls': list_directory,
        'cat': view_file,
        'get': get_file
    }

    action = get_action()

    func = action_map.get(action, lambda: invalid_action())

    func()

if __name__ == "__main__":
    if len(sys.argv) <= 1:
        print('No command specified, try `qtip help` for help!')
        sys.exit()

    map_actions_to_operations()