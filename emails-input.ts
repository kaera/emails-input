import './emails-input.css';

interface Email {
    value: string;
    isValid: boolean;
}

export interface EmailsInputAPI {
    addEmail: (email: string) => void;
    getEmailCount: () => number;
}

declare global {
    interface Window {
        EmailsInput: (rootNode: Element | null) => EmailsInputAPI;
        clipboardData?: {
            getData: (type: 'Text') => string;
        };
    }
}

export function EmailsInput(rootNode: Element | null) {
    if (!rootNode) {
        throw new Error('Missing root node');
    }

    rootNode.classList.add('emails-input');
    rootNode.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.className === 'emails-input--remove-button') {
            const emailTag = target.parentNode as Node;
            let emailIndex = 0;
            // Array.prototype.findIndex isn't available in IE11
            for (let i = 0; i < emails.length; i++) {
                if (emails[i].value === target.dataset.value) {
                    emailIndex = i;
                    break;
                }
            }
            emails.splice(emailIndex, 1);
            rootNode.removeChild(emailTag);
        } else {
            input.focus();
        }
    });

    const flushInputValue = () => {
        if (input.value) {
            addEmail(input.value);
        }
        input.value = '';
    };

    const input = document.createElement('input');
    input.setAttribute('placeholder', 'add more people...');
    input.className = 'emails-input--input';
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            flushInputValue();
        }
    });
    input.addEventListener('blur', flushInputValue);

    input.addEventListener(
        'paste',
        (e: ClipboardEvent & { originalEvent?: ClipboardEvent }) => {
            e.preventDefault();
            flushInputValue();

            let clipboardText: string = '';

            const clipboardData =
                e.clipboardData || e.originalEvent?.clipboardData;
            if (clipboardData) {
                clipboardText = clipboardData.getData('text/plain');
            }
            if (window.clipboardData) {
                // IE11
                clipboardText = window.clipboardData.getData('Text');
            }
            if (clipboardText) {
                clipboardText.split(/[,\s]+/).forEach(addEmail);
            }
        },
    );
    rootNode.appendChild(input);

    const emails: Email[] = [];

    const addEmail = (email: string): void => {
        const isValid = /^[^\s,@]+@[^\s,@]+$/.test(email);
        emails.push({
            value: email,
            isValid,
        });
        const emailTag = document.createElement('span');
        emailTag.textContent = email;
        emailTag.classList.add('emails-input--tag');
        emailTag.classList.add(
            isValid ? 'emails-input--tag-valid' : 'emails-input--tag-invalid',
        );
        const removeBtn = document.createElement('span');
        removeBtn.className = 'emails-input--remove-button';
        removeBtn.dataset.value = email;
        emailTag.appendChild(removeBtn);
        rootNode.insertBefore(emailTag, input);
    };

    return {
        addEmail,
        getEmailCount: (): number =>
            new Set(
                emails
                    .filter((email) => email.isValid)
                    .map((email) => email.value),
            ).size,
    };
}
window.EmailsInput = EmailsInput;
