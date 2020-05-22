import os
import re
import json
import sys
import requests
import urllib.request
from qtip_cli.helpers.env import get_if_qtip_is_dev, get_server_path, get_auth_token_header
from qtip_cli.helpers.args import get_file_to_upload, get_path_to_host
from qtip_cli.helpers import send_request

allowed_file_types = ['txt', 'md', 'json', 'js', 'tsx']



def upload_image(file_path):
    file_to_upload_path = os.path.join(os.path.dirname(get_file_to_upload()), file_path.replace('./', ''))

    path = get_path_to_host()
    request_path = get_server_path() + '/___image'

    request_headers = {
        'X-AUTH-TOKEN': get_auth_token_header(),
    }

    url = request_path
    data = { 'path': path }

    files = {'file': open(file_to_upload_path, 'rb')}
    r = requests.post(url, data=data, files=files, headers=request_headers)


def validate_file(file_name):
    obj = file_name.split('.')

    if len(obj) == 1:
        return

    if obj[-1] in allowed_file_types:
        return

    allowed_file_types_str = ', '.join(allowed_file_types)
    raise NameError(f'File is an invalid type. Allowed file extensions {allowed_file_types_str}')


def upload_and_serve_file(viaPublish = False):
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
    public_url = request_path

    is_public = "-p" in sys.argv or viaPublish

    if is_public:
        request_path = request_path + '?forcePublic=true'

    request = urllib.request.Request(request_path, data=request_params,
                                     headers=request_headers)

    response = send_request(request)

    data = json.load(response)

    images_to_upload = data.get('imagesToUpload')

    if not images_to_upload or len(images_to_upload) == 0:
        print(f'This page is now served')

        if is_public:
            print(f'It should be available on when public :\n{public_url}')
        else:
            print(f'This page is not public yet! Please run the command:\n\nqtip public {get_path_to_host()} \n To make this page public to the world.')

        if not viaPublish:
            sys.exit()

    # upload images
    for imagePath in images_to_upload:
        upload_image(imagePath)