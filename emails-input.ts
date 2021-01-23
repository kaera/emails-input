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
    input.setAttribute('style', 'border: 0; outline: 0');
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
            const emailTag = document.createElement('span');
            emailTag.textContent = email;
            emailTag.className = 'email-tag';
            emailTag.setAttribute(
                'style',
                `
                margin: 4px 8px 4px 0;
                font-size: 14px;
                line-height: 24px;
                display: inline-block;

                background: rgba(102, 153, 255, 0.2);
                border-radius: 100px;
                padding: 0 24px 0 10px;
            `,
            );
            rootNode.insertBefore(emailTag, input);
        },
        getEmailCount: (): number =>
            new Set(
                emails
                    .filter((email) => email.isValid)
                    .map((email) => email.value),
            ).size,
    };
}
