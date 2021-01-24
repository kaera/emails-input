import { EmailsInput, EmailsInputAPI } from './emails-input';

describe(__filename, () => {
    let component: EmailsInputAPI;
    let rootNode: HTMLElement;

    beforeEach(() => {
        rootNode = document.createElement('div');
        document.body.appendChild(rootNode);
        component = EmailsInput(rootNode);
    });

    afterEach(() => {
        rootNode.remove();
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
    });

    describe('DOM', () => {
        it('should render valid email tag', () => {
            component.addEmail('foo@example.com');
            const emailTag = rootNode.querySelector('.email-tag');
            expect(emailTag?.textContent).toBe('foo@example.com');
            expect(emailTag?.classList.contains('valid')).toBeTruthy();
        });

        it('should render invalid email tags', () => {
            component.addEmail('foo');
            const emailTag = rootNode.querySelector('.email-tag');
            expect(emailTag?.textContent).toBe('foo');
            expect(emailTag?.classList.contains('invalid')).toBeTruthy();
        });

        it('should remove email tags', () => {
            component.addEmail('foo@example.com');
            const removeButton = rootNode.querySelector(
                '.remove-button',
            ) as HTMLButtonElement;
            removeButton.click();
            expect(component.getEmailCount()).toBe(0);
            expect(rootNode.querySelector('.email-tag')).toBeNull();
        });

        it('should add email by pressing comma', () => {
            const input = rootNode.querySelector('.input') as HTMLInputElement;
            input.value = 'foo@example.com';
            input.dispatchEvent(new KeyboardEvent('keypress', { key: ',' }));
            expect(component.getEmailCount()).toBe(1);
            expect(input.value).toBe('');
        });

        it('should add email by pressing enter', () => {
            const input = rootNode.querySelector('.input') as HTMLInputElement;
            input.value = 'foo@example.com';
            input.dispatchEvent(
                new KeyboardEvent('keypress', { key: 'Enter' }),
            );
            expect(component.getEmailCount()).toBe(1);
            expect(input.value).toBe('');
        });

        it('should add email on input blur event', () => {
            const input = rootNode.querySelector('.input') as HTMLInputElement;
            input.value = 'foo@example.com';
            input.dispatchEvent(new Event('blur'));
            expect(component.getEmailCount()).toBe(1);
            expect(input.value).toBe('');
        });

        it('should add emails on paste event', () => {
            const input = rootNode.querySelector('.input') as HTMLInputElement;
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
            const input = rootNode.querySelector('.input') as HTMLInputElement;
            window.clipboardData = {
                getData() {
                    return 'foo@example.com, bar@example.com';
                },
            };
            input.dispatchEvent(new Event('paste'));
            expect(component.getEmailCount()).toBe(2);
            expect(input.value).toBe('');
        });
    });
});
