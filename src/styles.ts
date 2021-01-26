import styles from './emails-input.css';

const defaultStyles: { [index: string]: string } = {
    root: 'root',
    tag: 'tag',
    valid: 'valid',
    invalid: 'invalid',
    remove: 'remove',
    input: 'input',
};

// IE11 doesn't support Object.assign
for (const key in styles) {
    defaultStyles[key] = (styles as { [index: string]: string })[key];
}

export default defaultStyles;
