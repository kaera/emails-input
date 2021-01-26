import styles from './emails-input.css';

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

export class EmailsInput implements EmailsInputAPI {
    // The choice of this data structure has pros and cons
    // Pros: the runtime complexity of adding email, removing email,
    //       and getting emails count is O(1)
    // Cons: with current implementation, the runtime complexity
    //       of getting the email list would be O(n)
    private emails: {
        [email: string]: {
            num: number;
            isValid: boolean;
        };
    } = {};
    private validEmailCount: number = 0;

    private input: HTMLInputElement;

    constructor(private readonly rootNode: Element | null) {
        if (!rootNode) {
            throw new Error('Missing root node');
        }

        if (rootNode.classList.contains(styles.root)) {
            throw new Error(
                `EmailsInput is already initialized on ${rootNode}`,
            );
        }

        rootNode.classList.add(styles.root);
        rootNode.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.className === styles.remove) {
                const emailTag = target.parentNode as Node;
                const email = this.emails[target.dataset.value!];
                email.num--;
                if (email.isValid && email.num === 0) {
                    this.validEmailCount--;
                }
                rootNode.removeChild(emailTag);
            } else if (!target.classList.contains(styles.tag)) {
                this.input.focus();
            }
        });

        this.input = this.buildInput();
        rootNode.appendChild(this.input);
    }

    addEmail(value: string): void {
        value = value.trim();
        if (!value) {
            return;
        }

        if (!(value in this.emails)) {
            this.emails[value] = {
                num: 0,
                isValid: /^[^\s,@]+@[^\s,@]+$/.test(value),
            };
        }

        const email = this.emails[value];
        email.num++;
        if (email.isValid && email.num === 1) {
            this.validEmailCount++;
        }

        const emailTag = document.createElement('span');
        emailTag.textContent = value;
        emailTag.classList.add(styles.tag);
        emailTag.classList.add(email.isValid ? styles.valid : styles.invalid);
        const removeBtn = document.createElement('span');
        removeBtn.className = styles.remove;
        removeBtn.dataset.value = value;
        emailTag.appendChild(removeBtn);
        this.rootNode!.insertBefore(emailTag, this.input);
    }

    getEmailCount(): number {
        return this.validEmailCount;
    }

    private flushInputValue() {
        if (this.input.value) {
            this.addEmail(this.input.value);
        }
        this.input.value = '';
    }

    private buildInput() {
        const input = document.createElement('input');

        input.setAttribute('placeholder', 'add more people...');
        input.className = styles.input;
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                this.flushInputValue();
            }
        });
        input.addEventListener('blur', () => this.flushInputValue());

        input.addEventListener(
            'paste',
            (e: ClipboardEvent & { originalEvent?: ClipboardEvent }) => {
                e.preventDefault();
                this.flushInputValue();

                const clipboardText = getClipboardText(e);
                if (clipboardText) {
                    clipboardText
                        .split(/[,\s]+/)
                        .forEach((email) => this.addEmail(email));
                }
            },
        );
        return input;
    }
}

window.EmailsInput = function (rootNode) {
    return new EmailsInput(rootNode);
};
