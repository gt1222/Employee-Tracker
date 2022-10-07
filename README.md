# Employee-Tracker

## Description
The easiest part of this project was setting up the schema and seeds file, importing the required packages and connecting to the database. I also enjoyed using inquirer so setting the menu prompt and questions were pretty easy. The easiest function to do was adding the department. Everything after gave me such a headache.

Adding the Role took me so long because my inputs were being added but nothing was showing up on the table. It wasn't until I opened mysql to view the table there, was I able to see that the inputs were null and 0's. I figured out I had to get my data inputted as strings and numbers. Once I tackled this function the others were a bit easier with a couple of tweaks. Adding employees took so long because I had no idea how to get the null value being none and where that specific block of code should be so the variable would actually work.

I'm satisfied with the project because I finished what needed to be done even if it took weeks to do. The only thing I would change would be making a separate file for my queries so my codes would be nicer to look at.

## Installation
1. Download or clone repository
2. Node.js is required to run application
3. `npm install inquirer`
4. `npm install mysql2`
5. `npm install console.table`

## Usage
The application will be invoked by using the following command:

```bash
npm start
```
![command-line app demo gif](Images/Employee-Tracker-Video.gif)


## Links
[DEMO LINK](https://drive.google.com/file/d/1cdgwT34IB17lS0Zdsj85QXVOdoOzx9eD/view?usp=sharing)
[Github](https://github.com/gt1222/Employee-Tracker)