# emails-input

Vanilla emails input component

Demo: https://kaera.github.io

Tested in Chrome, Safari, Firefox, Edge, IE11

## Usage

```
<div id="emails-input"></div>
<script src="emails-input.js"></script>
<script>
  var inputContainerNode = document.querySelector('#emails-input');
  var emailsInput = EmailsInput(inputContainerNode);
  emailsInput.addEmail('foo@example.com');
  console.log(emailsInput.getEmailCount();
</script>
```

## Development

Run `npm start` for dev mode

Run `npm test` for running tests

Run `npm run build` for building production bundle in `dist` folder

## Next steps

-   Better duplicates handling (highlight/ignore duplications or show warnings)
-   Remove email blocks on backspace
-   Implement serialization (add hidden input field to store the email values)
