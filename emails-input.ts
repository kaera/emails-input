interface Email {
    value: string;
    isValid: boolean;
}

export function EmailsInput(rootNode: Element | null) {
    if (!rootNode) {
        throw new Error('Missing root node');
    }

    rootNode.classList.add('emails-input');
    rootNode.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.className === 'remove-button') {
            const emailTag = target.parentNode as Node;
            const index = Array.from(rootNode.childNodes).indexOf(
                emailTag as ChildNode,
            );
            emails.splice(index, 1);
            rootNode.removeChild(emailTag);
        } else {
            input.focus();
        }
    });

    const input = document.createElement('input');
    input.setAttribute('placeholder', 'add more people...');
    input.className = 'input';
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = input.value;
            if (value) {
                addEmail(value);
            }
            input.value = '';
        }
    });
    input.addEventListener('blur', (e) => {
        const value = input.value;
        if (value) {
            addEmail(value);
        }
        input.value = '';
    });
    rootNode.appendChild(input);

    const style = document.createElement('style');
    style.textContent = `
        .emails-input {
            border: 1px solid #c3c2cf;
            border-radius: 4px;
            overflow: auto;
            background: #fff;
            height: 88px;
            padding: 4px 7px;
            cursor: text;
            font-size: 14px;
            line-height: 24px;
            color: #050038;
        }
        .email-tag {
            margin: 4px 8px 0 0;
            display: inline-block;
        }

        .valid {
            background: rgba(102, 153, 255, 0.2);
            border-radius: 100px;
            padding: 0 10px;
        }

        .invalid {
            border-bottom: 1px dashed #d92929;
        }

        .remove-button {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-left: 8px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z' fill='currentColor'/%3E%3C/svg%3E");
            cursor: pointer;
        }

        .input {
            border: 0;
            outline: 0;
            display: inline-block;
            margin-top: 4px;
        }
    `;
    rootNode.appendChild(style);

    const emails: Email[] = [];

    const addEmail = (email: string): void => {
        const isValid = /^[^\s,@]+@[^\s,@]+$/.test(email);
        emails.push({
            value: email,
            isValid,
        });
        const emailTag = document.createElement('span');
        emailTag.textContent = email;
        emailTag.classList.add('email-tag');
        emailTag.classList.add(isValid ? 'valid' : 'invalid');
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-button';
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
