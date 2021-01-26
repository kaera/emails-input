import { EmailsInputAPI } from './emails-input';

declare global {
    interface Window {
        EmailsInput: (rootNode: Element | null) => EmailsInputAPI;
    }
}

const inputContainerNode = document.body.querySelector('#emails-input');
var emailsInput = window.EmailsInput(inputContainerNode);
document.body.querySelector('#add-email')!.addEventListener('click', () => {
    emailsInput.addEmail(
        Math.random().toString(36).slice(2, 10) + '@example.com',
    );
});
document.body
    .querySelector('#show-email-count')!
    .addEventListener('click', () => {
        alert(emailsInput.getEmailCount());
    });
emailsInput.addEmail('john@miro.com');
emailsInput.addEmail('invalid.email');
emailsInput.addEmail('mike@miro.com');
emailsInput.addEmail('alexander@miro.com');
