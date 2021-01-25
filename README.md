# emails-input
Vanilla emails input component

Demo: https://kaera.github.io

Tested in Chrome, Safari, Firefox, IE11

## Usage
```
<head>
  <link rel="stylesheet" href="emails-input.css"></head>
</head>
<body>
  <div id="emails-input"></div>
  <script src="emails-input.js"></script>
  <script>
    var inputContainerNode = document.querySelector('#emails-input');
    var emailsInput = EmailsInput(inputContainerNode);
    emailsInput.addEmail('foo@example.com');
    console.log(emailsInput.getEmailCount();
  </script>
</body>
```

## Development
Run `npm start` for dev mode

Run `npm test` for running tests

Run `npm run build` for building production bundle in `dist` folder

## Next steps
* Inline css into js assets
* Better duplicates handling (highlight/ignore duplications or show warnings)
* Remove email blocks on backspace
* Implement serialization (add hidden input field to store the email values)
* Implement more robust css selectors by adding suffixes during the build
