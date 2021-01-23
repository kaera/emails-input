import { EmailsInput } from './emails-input';

describe(__filename, () => {
    let component: any;
    let rootNode: HTMLElement;

    beforeEach(() => {
        rootNode = document.createElement('div');
        document.body.appendChild(rootNode);
        component = EmailsInput(rootNode);
        component.addEmail('foo@example.com');
    });

    describe('API', () => {
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
        it('should render email tags', () => {
            const emailTag = rootNode.querySelector('.email-tag');
            expect(emailTag?.textContent).toBe('foo@example.com');
        });
    });
});
