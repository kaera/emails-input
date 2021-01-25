import { EmailsInput, EmailsInputAPI } from './emails-input';

describe(__filename, () => {
    let component: EmailsInputAPI;
    let rootNode: HTMLElement;

    beforeEach(() => {
        rootNode = document.createElement('div');
        document.body.appendChild(rootNode);
        component = EmailsInput(rootNode)!;
    });

    afterEach(() => {
        rootNode.remove();
    });

    it('should not allow creating multiple components on single node', () => {
        expect(() => EmailsInput(rootNode)).toThrow(Error);
    });

    describe('API', () => {
        beforeEach(() => {
            component.addEmail('foo@example.com');
        });

        it('should return email count', () => {
            expect(component.getEmailCount()).toBe(1);
        });

        it('should not count invalid emails', () => {
            component.addEmail('foo');
            expect(component.getEmailCount()).toBe(1);
        });

        it('should not count duplicate emails', () => {
            component.addEmail('foo@example.com');
            expect(component.getEmailCount()).toBe(1);
        });

        it('should not add empty emails', () => {
            component.addEmail('    ');
            expect(component.getEmailCount()).toBe(1);
        });
    });

    describe('DOM', () => {
        it('should render valid email tag', () => {
            component.addEmail('foo@example.com');
            const emailTag = rootNode.querySelector('.emails-input--tag');
            expect(emailTag?.textContent).toBe('foo@example.com');
            expect(
                emailTag?.classList.contains('emails-input--tag-valid'),
            ).toBeTruthy();
        });

        it('should trim spaces', () => {
            component.addEmail('foo@example.com   ');
            const emailTag = rootNode.querySelector('.emails-input--tag');
            expect(emailTag?.textContent).toBe('foo@example.com');
        });

        it('should render invalid email tags', () => {
            component.addEmail('foo');
            const emailTag = rootNode.querySelector('.emails-input--tag');
            expect(emailTag?.textContent).toBe('foo');
            expect(
                emailTag?.classList.contains('emails-input--tag-invalid'),
            ).toBeTruthy();
        });

        it('should remove email tags', () => {
            component.addEmail('foo@example.com');
            const removeButton = rootNode.querySelector(
                '.emails-input--remove-button',
            ) as HTMLButtonElement;
            removeButton.click();
            expect(component.getEmailCount()).toBe(0);
            expect(rootNode.querySelector('.emails-input--tag')).toBeNull();
        });

        it('should add email by pressing comma', () => {
            const input = rootNode.querySelector(
                '.emails-input--input',
            ) as HTMLInputElement;
            input.value = 'foo@example.com';
            input.dispatchEvent(new KeyboardEvent('keypress', { key: ',' }));
            expect(component.getEmailCount()).toBe(1);
            expect(input.value).toBe('');
        });

        it('should add email by pressing enter', () => {
            const input = rootNode.querySelector(
                '.emails-input--input',
            ) as HTMLInputElement;
            input.value = 'foo@example.com';
            input.dispatchEvent(
                new KeyboardEvent('keypress', { key: 'Enter' }),
            );
            expect(component.getEmailCount()).toBe(1);
            expect(input.value).toBe('');
        });

        it('should add email on input blur event', () => {
            const input = rootNode.querySelector(
                '.emails-input--input',
            ) as HTMLInputElement;
            input.value = 'foo@example.com';
            input.dispatchEvent(new Event('blur'));
            expect(component.getEmailCount()).toBe(1);
            expect(input.value).toBe('');
        });

        it('should add emails on paste event', () => {
            const input = rootNode.querySelector(
                '.emails-input--input',
            ) as HTMLInputElement;
            const e = new Event('paste') as Event & {
                clipboardData: { getData: () => string };
            };
            e.clipboardData = {
                getData() {
                    return 'foo@example.com, bar@example.com';
                },
            };
            input.dispatchEvent(e);
            expect(component.getEmailCount()).toBe(2);
            expect(input.value).toBe('');
        });

        it('should add emails on paste event in IE11', () => {
            const input = rootNode.querySelector(
                '.emails-input--input',
            ) as HTMLInputElement;
            window.clipboardData = {
                getData() {
                    return 'foo@example.com, bar@example.com';
                },
            };
            input.dispatchEvent(new Event('paste'));
            expect(component.getEmailCount()).toBe(2);
            expect(input.value).toBe('');
        });

        it('should focus on click on component', () => {
            const input = rootNode.querySelector(
                '.emails-input--input',
            ) as HTMLInputElement;
            rootNode.click();
            expect(window.document.activeElement).toEqual(input);
        });

        it('should not focus on click on email tag', () => {
            component.addEmail('foo@example.com   ');

            const emailTag = rootNode.querySelector(
                '.emails-input--tag',
            ) as HTMLInputElement;
            const input = rootNode.querySelector(
                '.emails-input--input',
            ) as HTMLInputElement;
            emailTag.click();
            expect(window.document.activeElement).not.toEqual(input);
        });
    });
});
