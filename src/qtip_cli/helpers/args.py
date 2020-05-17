import sys
import os

# arg1 = action
# arg2 = path on website
# arg3 = file to upload
def get_action():
    return sys.argv[1]

def get_file_to_upload():
    arg_file_path = sys.argv[3]

    return os.path.join(os.getcwd(), arg_file_path)

def get_path_to_host():
    return sys.argv[2]
