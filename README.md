# Project-2

## Project Goals
    - Needs a Purpose
    - Needs User accounts and uses for those accounts
    - Needs to be designed in a way to where it could make a profit? (Ads, subscriptions etc.)
    - Don't ask to collect / store info
    - Account Page to with a button to toggle premium mode to show the functionality 
    - Engaging




## Project Requirements
    - Different from domo HW
    - 5 dynamic react components other than login/signup/password change
    - dynamic pages/views - Changes based on user/context
    - Login/signup system to be managed by redis
    - passwords stored using bcrypt
    - server must read/write from and to mongoDB using Mongoose. 
        * Some amount of this data should only be accessible to a subset of users
    - fetch requests be used 
    - Server code must use Get and Post requests
    - must have a 404 page or redirection page for non existant pages
    - server code must return appropriate status codes
    - Client code written with react
    - server code written in node with express
    - project mist use handlebars view engine
    - cannot use a CMS (Content Management System) like ghost, or keystoneJS, etc.
    - if you want, you can use an external web API
    - Code must be transpiled and bundled using webpack and babel
    - must use ESLint with the Airbnb spec




## Project Example
    - Twitter - https://twitter.com/
    Twitter is an excellent example of something doable for this project. Users can make
    accounts that allow them to 1) make tweets and 2) follow other accounts to see their
    tweets. Twitter also has some privacy settings to restrict information based on user
    preferences






## Ideas
    - twitter clone kindof.
    - make a web app that allows users to signup/login/change password
    - allow users to post status updates (ex; status: working. Mood; tired)
    - allows for following other accounts
    - The basic mode will let users post 1 word responses for their things so only 3 words max each for status and mood
    - Premium will let users write as much as they want for their status and their mood
    - since theres no acutal payment going on and its just a project, there will be a button at the very bottom that will toggle between standard and premium






# Final Idea
    - **The slap from victorious mixed with twitter**
    - Web app allows users to signup/Login/change password
    - Allows users to post status updates with a few words and an emoji
        - *Example*;  Presley Smith - Update
                      Running for my life!!

                      Feeling: Scared!! 😨

                      Link to example image: [Link to Example Image]()

    - Status updates will be limited to less words *around 5* until premium is activated
    - Premium (not actually requiring payment) will allow users to make their updates without limitation. 

