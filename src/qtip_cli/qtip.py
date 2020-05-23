#!/usr/bin/env python3
import sys
import os
import json
import urllib.request
import urllib

from qtip_cli.helpers import send_request
from qtip_cli.helpers.args import get_action, get_file_to_upload, get_path_to_host
from qtip_cli.helpers.env import get_if_qtip_is_dev, get_server_path, get_auth_token_header

from qtip_cli.actions.preview.preview import init_preview
from qtip_cli.actions.upload_and_serve_file import upload_and_serve_file

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'



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


# makes a file public to be viewed
def make_private():
    path = get_path_to_host()

    print(f'This will make the file `{path}` hidden to everyone on the internet!\n\n')

    ans = input('Confirm making file private (y/n): ')

    if ans != 'y':
        print('Operation aborted')
        sys.exit()

    request_path = get_server_path() + path + '?method=make-private'
    request_headers = {'X-AUTH-TOKEN': get_auth_token_header()}
    request = urllib.request.Request(request_path, headers=request_headers)
    request.get_method = lambda: 'PUT'
    send_request(request)

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

def restrict_access_code():
    path = get_path_to_host()
    access_code = sys.argv[3]

    request_path = get_server_path() + path + '?method=restrict-access-code'

    request_headers = {'X-AUTH-TOKEN': get_auth_token_header(), 'content-type': 'application/json'}
    payload = {"code": access_code}
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
    if len(sys.argv) <= 1:
        print('No command specified, try `qtip help` for help!')
        sys.exit()

    action_map = {
        'serve': upload_and_serve_file,
        'delete': delete_file,
        'help': show_help,
        'public': make_public,
        'private': make_private,
        'restrictip': restrict_ip,
        'restrictcode': restrict_access_code,
        'ls': list_directory,
        'cat': view_file,
        'get': get_file,
        'preview': init_preview
    }

    action = get_action()

    func = action_map.get(action, lambda: invalid_action())

    func()

def get_exception():
    """Helper function to work with py2.4-py3 for getting the current
    exception in a try/except block
    """
    return sys.exc_info()[1]

def main():
    try:
        map_actions_to_operations()
    except KeyboardInterrupt:
        print('goodbye!')

if __name__ == "__main__":
    main()