function EmailsInput(rootNode: Element | null) {
    if (!rootNode) {
        throw new Error('Missing root node')
    }
    console.log('init emails input in', rootNode)
    return {
        addEmail: (email: string) => {
            console.log('!!!', email)
        }
    }
}
