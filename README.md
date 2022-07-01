# onedrive_mapper

To run, follow the below steps:

1: Ensure you create a .env file with correct info inside of this repo. View the ".envexample" file as a format. Copy all of its contents into your own local .env file, then replace the bracketed sections with variables from your own microsoft tenant. You will need to create a new app registration, add the file.read.all, user.read.all, and directory.read.all API permissions, as well as generate a secret inside of the app registration.

2: Ensure you have node installed locally (these scripts have been tested and verified with a couple different node 14 versions).

3: Ensure you have npm installed (these scripts have been tested and verified with versions 6.x.y).

4: Run "npm install" inside of this repo to install required packages.

5: Run "npm start" and this will kick off onedrive_mapping.js, which is the starter file.


Overview:
    This runs the main script, onedrive_mapping.js, which then calls on getDrives() locally, which in turn calls on various functions inside of the helpers folder in order to accomplish the task of grabbing all users drive items and associated permissions. It creates one csv list per user.



Email "chase@wiseguyz.com" with questions