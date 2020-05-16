import urllib.request
import sys

def send_request(request):
    try:
        response = urllib.request.urlopen(request)

        return response
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'Error: {body}')
        sys.exit()
