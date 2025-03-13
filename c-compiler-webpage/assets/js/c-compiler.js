// Simulated C Compiler functionality
class CCompiler {
    constructor() {
        this.defaultHeaders = '#include <stdio.h>\n#include <stdlib.h>\n';
    }

    // Function to validate C code
    validateCode(code) {
        if (!code || typeof code !== 'string' || code.trim() === '') {
            throw new Error('Code cannot be empty');
        }

        // Basic validation checks
        const mainFunctionCheck = /\bmain\s*\([^)]*\)\s*{/;
        if (!mainFunctionCheck.test(code)) {
            throw new Error('No main() function found');
        }

        return true;
    }

    // Function to simulate compilation and execution
    compile(code) {
        try {
            if (!code || typeof code !== 'string') {
                throw new Error('Invalid code input');
            }

            this.validateCode(code);

            // Simulate compilation delay
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Check for common errors
                    const errors = this.checkForCommonErrors(code);
                    if (errors.length > 0) {
                        resolve({
                            success: false,
                            output: `Compilation Error(s):\n${errors.join('\n')}`,
                            type: 'error'
                        });
                        return;
                    }

                    // Simulate successful compilation
                    resolve({
                        success: true,
                        output: 'Compilation successful!\n\nProgram Output:\n' + this.simulateExecution(code),
                        type: 'success'
                    });
                }, 1000);
            });
        } catch (error) {
            return Promise.resolve({
                success: false,
                output: `Error: ${error.message}`,
                type: 'error'
            });
        }
    }

    // Function to check for common C programming errors
    checkForCommonErrors(code) {
        if (!code || typeof code !== 'string') {
            return ['Invalid code input'];
        }

        const errors = [];

        try {
            // Check for missing semicolons
            const lines = code.split('\n');
            lines.forEach((line, index) => {
                const trimmedLine = line.trim();
                if (trimmedLine !== '' && 
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

            // Check for printf without format string
            if (code.includes('printf(') && !code.match(/printf\s*\(\s*["']/)) {
                errors.push('printf() used without format string');
            }
        } catch (error) {
            errors.push('Error analyzing code: ' + error.message);
        }

        return errors;
    }

    // Function to simulate program execution
    simulateExecution(code) {
        if (!code || typeof code !== 'string') {
            return 'Error: Invalid code input';
        }

        try {
            // Extract printf statements and simulate their output
            let output = '';
            const printfRegex = /printf\s*\(\s*"([^"]+)"\s*(?:,\s*([^)]+))?\s*\)/g;
            let match;

            while ((match = printfRegex.exec(code)) !== null) {
                let formatString = match[1];
                const args = match[2] ? match[2].split(',').map(arg => arg.trim()) : [];
                
                // Replace format specifiers with placeholder values
                formatString = formatString.replace(/%d/g, '42');
                formatString = formatString.replace(/%f/g, '3.14');
                formatString = formatString.replace(/%c/g, 'X');
                formatString = formatString.replace(/%s/g, 'string');
                
                output += formatString + '\n';
            }

            return output || 'No output generated';
        } catch (error) {
            return 'Error executing code: ' + error.message;
        }
    }
}

// Export the compiler instance
window.compiler = new CCompiler();
