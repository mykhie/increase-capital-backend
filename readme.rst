###################
About this app
###################

This is a simple app built with codeigniter(php 7.2) and angularjs.
All the data i accessed via by unauthorized APIs

*******************
How to set up
*******************
Clone this project into a folder called prac.In a scenario you decide to use a different name,please go to ```angular\constants.js``` and the first line.Remove the word prac and replace it with you folder name.
In a scenario you use a virtual host or nginx,you can remove the work ```prac``` totally.

**************************
Database Connections
**************************
On the root of the project,there is a file ```config.json``` that has DB credentials.
They can be changed to match the your current database

On the root folder,there is a .SQL file.Please run that against you database so as to generate scripts and populate with data

You can now access the app via the browser e.g http://localhost:9000/
