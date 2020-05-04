## QTip 
QTip is a self-hosted _text hosting platform_ that is managed via command-line. 
A text hosting platform is a service that serves simple text-based content similarly to a blog. 
The difference between a blog and a text hosting platform is text hosting services are usually meant for infrequently inserted evergreen content.

Some examples of pages that could exist on a text hosting platform:

* Recipes for food
* Lists of favorite software
* Code snippets that are used as reference 

 
QTip provides you the ability to quickly host any text file (with markdown support!) with one line of code.

The line below will serve `fried-chicken-recipe.md` on `yourdomain.com/recepies/fried-chicken`
```
qtip serve /recepies/fried-chicken fried-chicken-recipe.md
```

### Features
* Markdown file support 
* Automatically uploads and stores local images embedded in markdown to your preferred CDN
* 100% self-hosted 🚀 

### Demo
There is a demo of this service here:
[https://qtip.shub.club/qtip-demo](https://qtip.shub.club/qtip-demo)

### How it works
#### The Gist
As of version 0.1.0 QTip takes the contents of a text/markdown/json file and stores it as a attribute of a document in mongodb. The datastructure looks as follows:
```
{
    path: string[]; // the deconstructed url path split into an array by "/"
    content: string;
    title: string; // auto-generated from the first line of the file
    public: boolean;
    restrictions?: { ipList: string[] } // optional
}
```

When a user visits a url on the qtip server, the qtip server will match the url to a path if it exists and returns the content stored in the string.

#### File-as-Folder System
Let's say a user saves a file under the path `/recipies` and then another file under the name `/recipies/chicken`. QTip will show a small display on the `/recipies` page that indicates there are "children" to the path provided. [See this page as an example](https://qtip.shub.club/qtip-demo/parent).



### Installation
#### Server
Before installing this software, please make sure you have the following software:
* Node.js version 12.6.1 or above
* MongoDB version 4.0.0 or above

Once you have the software installed above, complete the following steps:
1. Clone this repo
    ```
    git clone https://github.com/4shub/qtip.git 
    ```

1. Set your environment variables
    ```bash
    export MONGODB_URI=your-mongodb-connection-tring
    export QTIP_AUTH_TOKEN=the-auth-token-used-to-validate-your-service
    export AWS_ACCESS_KEY_ID=the-aws-access-key
    export AWS_SECRET_ACCESS_KEY=the-aws-secret-key


    ```
1. Install required dependencies
    ```
    npm i
    ```
    
1. Build and run the server
    ```
    npm build
    npm start
    ```

#### Client
To run the client make sure you have the following installed:
* Python 3.7 or higher

1. Clone this repo
    ```
    git clone https://github.com/4shub/qtip.git 
    ```

1. Set your environment variables
    ```
    export QTIP_AUTH_TOKEN=the-auth-token-used-to-validate-your-service
    export QTIP_SERVER=http://your-qtip-server-location.com
    ```

1. Then add the following line to you `bash_profile` or similar file
   
   ```
   alias qtip="python ./path/to/qtip/repo/scripts/qtip.py"
   ```

### Usage
#### Serving a file
To use qtip to serve a file, follow these instructions:

1. Navigate or create a file you would like uploaded, and run the following command
    ```
   qtip serve /path/to/serve filename
    ```
   
1. Files are hidden initially, you can make a file public to the internet by doing the following
    ```
   qtip public /path/to/serve 
    ```
   
   **Note: files cannot be made private once they go public**

    Sometimes you don't want a file to be public to everyone. You can instead restrict a file to particular ips by doing the following:
    
    ```
    qtip restrictip /path/to/serve 192.0.0.1,145.554.432.33
   ```
   Please list ips you want to restrict delineated by a comma
   **Note: You can only restrict private files**
   
#### Deleting a file
To delete a file, do the following:
```
qtip delete /path/to/serve
```

#### Other Commands
* `qtip ls /path` - lists all files within a particular serve route
* `qtip cat /path/to/file` - displays the file content in terminal
* `qtip get /path/to/file output_file_name.txt` - downloads file content to a specific file name

### Contributing
This project is in active development and would love some helping hands.




### WIP
This readme is a work in progress!
