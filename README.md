## QTip 
QTip is a self-hosted _text hosting platform_ that is managed via commandline. 
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

### Installation
Before installing this software, please make sure you have the following software installed:
* Node.js version 12.6.1 or above
* MongoDB version 4.0.0 or above

Below are instructions
1. Clone this repo
    ```
    git clone https://github.com/4shub/qtip.git 
    ```
1. Install required dependencies
    ```
    npm i
    ```
    
1. Run the server
    ```
    npm start
    ```

### Contributing
This project is in active development and would love some helping hands.




### WIP
This readme is a work in progress!