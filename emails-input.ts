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

    let validEmailCount = 0;
    const emails: {
        [email: string]: {
            num: number;
            isValid: boolean;
        };
    } = {};

    rootNode.classList.add('emails-input');
    rootNode.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.className === 'emails-input--remove-button') {
            const emailTag = target.parentNode as Node;
            const email = emails[target.dataset.value!];
            email.num--;
            if (email.num === 0) {
                validEmailCount--;
            }
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

    const addEmail = (value: string): void => {
        if (!(value in emails)) {
            emails[value] = {
                num: 0,
                isValid: /^[^\s,@]+@[^\s,@]+$/.test(value),
            };
        }

        const email = emails[value];
        email.num++;
        if (email.isValid && email.num === 1) {
            validEmailCount++;
        }

        const emailTag = document.createElement('span');
        emailTag.textContent = value;
        emailTag.classList.add('emails-input--tag');
        emailTag.classList.add(
            email.isValid
                ? 'emails-input--tag-valid'
                : 'emails-input--tag-invalid',
        );
        const removeBtn = document.createElement('span');
        removeBtn.className = 'emails-input--remove-button';
        removeBtn.dataset.value = value;
        emailTag.appendChild(removeBtn);
        rootNode.insertBefore(emailTag, input);
    };

    return {
        addEmail,
        getEmailCount: (): number => validEmailCount,
    };
}
window.EmailsInput = EmailsInput;
