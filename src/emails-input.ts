import styles from './styles';

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

function getClipboardText(
    e: ClipboardEvent & { originalEvent?: ClipboardEvent | undefined },
) {
    const clipboardData = e.clipboardData || e.originalEvent?.clipboardData;
    if (clipboardData) {
        return clipboardData.getData('text/plain');
    }
    if (window.clipboardData) {
        // IE11
        return window.clipboardData.getData('Text');
    }
}

function buildInput(addEmail: (value: string) => void) {
    const flushInputValue = () => {
        if (input.value) {
            addEmail(input.value);
        }
        input.value = '';
    };

    const input = document.createElement('input');

    input.setAttribute('placeholder', 'add more people...');
    input.className = styles.input;
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

            const clipboardText = getClipboardText(e);
            if (clipboardText) {
                clipboardText.split(/[,\s]+/).forEach(addEmail);
            }
        },
    );
    return input;
}

export function EmailsInput(rootNode: Element | null) {
    if (!rootNode) {
        throw new Error('Missing root node');
    }

    if (rootNode.classList.contains(styles.root)) {
        throw new Error(`EmailsInput is already initialized on ${rootNode}`);
    }

    let validEmailCount = 0;
    const emails: {
        [email: string]: {
            num: number;
            isValid: boolean;
        };
    } = {};

    rootNode.classList.add(styles.root);
    rootNode.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.className === styles.remove) {
            const emailTag = target.parentNode as Node;
            const email = emails[target.dataset.value!];
            email.num--;
            if (email.num === 0) {
                validEmailCount--;
            }
            rootNode.removeChild(emailTag);
        } else if (!target.classList.contains(styles.tag)) {
            input.focus();
        }
    });

    const addEmail = (value: string): void => {
        value = value.trim();
        if (!value) {
            return;
        }

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
        emailTag.classList.add(styles.tag);
        emailTag.classList.add(email.isValid ? styles.valid : styles.invalid);
        const removeBtn = document.createElement('span');
        removeBtn.className = styles.remove;
        removeBtn.dataset.value = value;
        emailTag.appendChild(removeBtn);
        rootNode.insertBefore(emailTag, input);
    };

    const input = buildInput(addEmail);
    rootNode.appendChild(input);

    return {
        addEmail,
        getEmailCount: (): number => validEmailCount,
    };
}
window.EmailsInput = EmailsInput;
