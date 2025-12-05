# HOWTO: Questionful CE

Welcome to **Questionful CE**! This guide explains the components available in the project and how to write your own `Questionful.json` files to render custom questionnaires.

---

## Available Components

The project includes the following React components:

| Component | Purpose |
|-----------|---------|
| **App.jsx** | Entry point; loads `Questionful.json`, manages state, renders questions. |
| **QuestionBox.jsx** | Renders a single question with input or selection. |
| **FormField.jsx** | Handles rendering different input types (short text, paragraph, dropdown, multiple choice, text block, image, heading). |
| **ProgressBox.jsx** | Shows the current question index and total questions. |
| **Styles** | `App.scss` and `main.css` provide layout, input, and button styling. |

---

## Writing `Questionful.json`

The `Questionful.json` file defines the questionnaire, including:

- **title** – The form’s title.
- **submission** – Optional, contains endpoint URL and headers for submission.
- **styles** – Colors and font for the questionnaire.
- **questions** – Array of question objects.

### Example:

```json
{
  "title": "Questionful Example Form",
  "submission": {
    "url": "http://localhost:4000/submit",
    "headers": {
      "Authorization": "Bearer YOUR_TOKEN_HERE"
    }
  },
  "styles": {
    "backgroundColor": "#ffd832",
    "primaryFontColor": "#333333",
    "secondaryFontColor": "#555555",
    "fontFamily": "'Open Sans', Helvetica, Arial, sans-serif"
  },
  "questions": [
    {
      "id": "name",
      "type": "short_text",
      "title": "What is your name?"
    },
    {
      "id": "bio",
      "type": "paragraph",
      "title": "Tell us a little about yourself"
    },
    {
      "id": "favorite_color",
      "type": "dropdown",
      "title": "Choose your favorite color",
      "options": ["Red", "Green", "Blue", "Yellow"]
    },
    {
      "id": "preferred_pet",
      "type": "multiple_choice",
      "title": "Which one pet do you prefer?",
      "options": ["Dog", "Cat", "Fish"],
      "multiple": false
    },
    {
      "id": "hobbies",
      "type": "multiple_choice",
      "title": "Select all hobbies you enjoy",
      "options": ["Reading", "Sports", "Cooking", "Music"],
      "multiple": true
    },
    {
      "id": "final_message",
      "type": "text_block",
      "text": "🎉 Thank you for completing the demo form!"
    }
  ]
}
