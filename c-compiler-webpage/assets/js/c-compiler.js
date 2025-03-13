class CCompiler {
    constructor() {
        console.log('C Compiler initialized');
    }

    async compile(code) {
        try {
            console.log('Compiling code:', code);
            
            // Basic validation
            if (!code || typeof code !== 'string') {
                throw new Error('Invalid code input');
            }

            // Check for main function
            if (!code.includes('main()')) {
                throw new Error('No main() function found');
            }

            // Check for basic syntax
            const errors = this.checkSyntax(code);
            if (errors.length > 0) {
                return {
                    success: false,
                    type: 'error',
                    output: 'Compilation Errors:\n' + errors.join('\n')
                };
            }

            // Simulate compilation delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Extract printf statements and simulate output
            const output = this.simulateExecution(code);

            return {
                success: true,
                type: 'success',
                output: 'Compilation successful!\n\nProgram Output:\n' + output
            };
        } catch (error) {
            console.error('Compilation error:', error);
            return {
                success: false,
                type: 'error',
                output: 'Error: ' + error.message
            };
        }
    }

    checkSyntax(code) {
        const errors = [];

        // Check for missing semicolons
        const lines = code.split('\n');
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine && 
                !trimmedLine.endsWith('{') && 
                !trimmedLine.endsWith('}') && 
                !trimmedLine.endsWith(';') &&
                !trimmedLine.startsWith('#')) {
                errors.push(`Line ${index + 1}: Missing semicolon`);
            }
        });

        // Check for unmatched braces
        const openBraces = (code.match(/{/g) || []).length;
        const closeBraces = (code.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push('Unmatched braces: Check your { } pairs');
        }

        // Check for printf format
        const printfCalls = code.match(/printf\s*\((.*?)\)/g) || [];
        printfCalls.forEach(call => {
            if (!call.includes('"')) {
                errors.push('printf() used without format string');
            }
        });

        return errors;
    }

    simulateExecution(code) {
        let output = '';

        // Extract printf statements
        const printfRegex = /printf\s*\(\s*"([^"]*)"/g;
        let match;

        while ((match = printfRegex.exec(code)) !== null) {
            let text = match[1];
            
            // Handle escape sequences
            text = text.replace(/\\n/g, '\n');
            text = text.replace(/\\t/g, '\t');
            text = text.replace(/\\r/g, '\r');
            
            // Handle format specifiers (simple simulation)
            text = text.replace(/%d/g, '0');
            text = text.replace(/%f/g, '0.0');
            text = text.replace(/%c/g, 'X');
            text = text.replace(/%s/g, 'string');
            
            output += text;
        }

        return output || 'No output';
    }
}

// Initialize compiler
window.compiler = new CCompiler();
console.log('C Compiler ready');
