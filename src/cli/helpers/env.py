import os

def get_if_qtip_is_dev():
    env = os.environ.get('QTIP_ENV')

    if (env == 'development'):
        return True

    return False

def get_server_path():
    if (get_if_qtip_is_dev()):
        return 'http://localhost:4225'

    return os.environ['QTIP_SERVER']


def get_auth_token_header():
    try:
        token = os.environ['QTIP_AUTH_TOKEN']
    except:
        raise NameError('QTIP_AUTH_TOKEN environment variable not set')

    return token
