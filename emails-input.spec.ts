import { EmailsInput } from './emails-input';

describe(__filename, () => {
    let component: any;

    beforeEach(() => {
        const rootNode = document.createElement('div');
        document.body.appendChild(rootNode);
        component = EmailsInput(rootNode);
    });

    test('should be defined', () => {
        expect(component).toBeDefined();
        expect(component.getEmailsCount()).toBe(0);
    });

    test('should add emails and return count', () => {
        component.addEmail('foo@example.com');
        expect(component.getEmailsCount()).toBe(1);
    });

    test('should not count invalid emails', () => {
        component.addEmail('foo');
        component.addEmail('foo@example.com');
        expect(component.getEmailsCount()).toBe(1);
    });

    test('should not count duplicate emails', () => {
        component.addEmail('foo@example.com');
        component.addEmail('foo@example.com');
        expect(component.getEmailsCount()).toBe(1);
    });
});
