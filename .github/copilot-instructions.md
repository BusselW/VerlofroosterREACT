1. Throughout the project, ensure that the HTML in .aspx files is setup as follows:
- It's a pure HTML file.
- We're fetching the REACT libraries from a CDN.
- We are declaring "h" as the global variable for react
- We are writing modules in vanilla Javascript (.js, not .jsx)
- The modules are logically separated into different files.
- The modules are imported in either the .aspx file or in a seperate .js file that is included in the .aspx file.