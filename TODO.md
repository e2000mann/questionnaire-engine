Last updated: 28/01/20

# Core Features
- [ ] Client Application for participants
  - [x] that makes it possible to fill in a questionnaire
  - [ ] that supports a linear flow of questions
    Required Types of questions
    - [x] text
    - [x] number
    - [x] single select
    - [x] multi select
  - [ ] that works on mobile

- [ ] Server
  - [x] that serves the client application
  - [x] that uses a json file for structuring the questionnaire
  - [x] that stores the responses submitted through API
  - [ ] that supports a download of the responses in a structured way (json, csv)
    - [x] database has boolean to determine json or csv
    - [x] responses save to json
    - [x] responses save to csv
    - [ ] downloadable

- [ ] Accessibility
  - [x] light/dark mode
  - [ ] responsive text through whole system
  - [x] favicon

# Optional Features
- [ ] ability to create questionnaire through GUI
  - [x] create.html created
- [ ] page that aggregates results and shows them via graphs, averages, etc
- [ ] Support for more complex types of questions:
  - [x] Likert Scales (strongly agree -> strongly disagree scale)
  - [ ] matrices
  - [ ] sliders
  - [x] support for selecting images
- [ ] support for branching: show optional questions based on answers of previous questions
- [ ] support for optional/required questions through boolean
  - [x] required
  - [ ] optional
- [x] security based on OAuth (google acc) authentication
  - [x] check if user is owner of questionnaire based on their email address

# Other
client/questionnaires/4d87e050-e74f-4de7-a144-6c76dac3622e
