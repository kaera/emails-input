interface Email {
    value: string;
    isValid: boolean;
}

export function EmailsInput(rootNode: Element | null) {
    if (!rootNode) {
        throw new Error('Missing root node');
    }

    rootNode.setAttribute(
        'style',
        `
        background: #fff;
        height: 90px;
        padding: 3px;
        cursor: text;
    `,
    );

    rootNode.addEventListener('click', () => {
        input.focus();
    });

    const input = document.createElement('input');
    input.setAttribute('placeholder', 'add more people...');
    input.setAttribute('style', 'border: 0');
    rootNode.appendChild(input);

    const emails: Email[] = [];

    function isValidEmail(email: string) {
        return /^[^\s,@]+@[^\s,@]+$/.test(email);
    }
    return {
        addEmail: (email: string): void => {
            emails.push({
                value: email,
                isValid: isValidEmail(email),
            });
        },
        getEmailsCount: (): number =>
            new Set(
                emails
                    .filter((email) => email.isValid)
                    .map((email) => email.value),
            ).size,
    };
}
