function EmailsInput(rootNode: Element | null) {
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
    rootNode.appendChild(input);

    return {
        addEmail: (email: string) => {
            console.log('!!!', email);
        },
    };
}
