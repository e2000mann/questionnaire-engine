# up887818 Web Programming CW - Questionnaire Engine

## Features
- Login using Google (OAuth)
- Being logged in allows for the following:
  - Creating questionnaires through JSON or GUI
  - Editing previously made questionnaires
  - Exporting questionnaire answers as either a CSV or JSON file
    - When creating a questionnaire, user will be prompted to choose between the 2 file formats. This is stored as a boolean variable in the database.
- Features all users can use:
  - Answer questionnaire
  - Share questionnaire on Facebook* or Twitter
- Support for the following types of questions:
  - Text "text"
  - Number "number"
  - Select
    - Single/Multi Text Select "single-select" "multi-select"
    - Single/Multi Image Select "single-select-image" "multi-select-image"
  - Likert Scale
    - Numbers "likert-scale-numbers"
      - Gives numbers 1 to 5
    - Values "likert-scale-values"
      - Gives "Very Unsatisfied" to "Very Satisfied"
    - Emojis "likert-scale-emoji"
      - Gives 😭, 😪, 😐, 🙂, 😁

## How it works
- Install dependencies (npm install)
- Database using PSQL (npm run setup)
- Server using node.js & express (npm start)

## Uploading pre-made JSON files for questionnaire
- Use the names written next to each type of question in "Features" to specify what each question is.
- For image questions write the filenames (w/o extension) in "options". Allowed image types are png, jpg & gif. Make sure the filenames are descriptive of the image as they are used for accessibility purposes.

*This works but because of COVID it can't be taken out of development mode
