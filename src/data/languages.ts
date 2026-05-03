export interface Language {
  name: string;
  id: string;
  extension: string;
  monacoLang: string;
  template: string;
}

export const languages: Language[] = [
  { name: "Python", id: "python", extension: ".py", monacoLang: "python", template: `# Welcome to OmniCode\nprint("Hello, World!")` },
  { name: "JavaScript", id: "javascript", extension: ".js", monacoLang: "javascript", template: `// Welcome to OmniCode\nconsole.log("Hello, World!");` },
  { name: "TypeScript", id: "typescript", extension: ".ts", monacoLang: "typescript", template: `// Welcome to OmniCode\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);` },
  { name: "HTML", id: "html", extension: ".html", monacoLang: "html", template: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>` },
  { name: "CSS", id: "css", extension: ".css", monacoLang: "css", template: `/* Welcome to OmniCode */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n    margin: 0;\n    padding: 20px;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}` },
  { name: "C", id: "c", extension: ".c", monacoLang: "c", template: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <limits.h>

int main() {
    // Enhanced C compiler with GCC/Clang compatibility
    printf("=== Enhanced C Compiler Demo ===\\n");
    
    // Type sizes (GCC/Clang compatible)
    printf("Type sizes:\\n");
    printf("  char: %zu bytes\\n", sizeof(char));
    printf("  int: %zu bytes\\n", sizeof(int));
    printf("  long: %zu bytes\\n", sizeof(long));
    printf("  long long: %zu bytes\\n", sizeof(long long));
    printf("  float: %zu bytes\\n", sizeof(float));
    printf("  double: %zu bytes\\n", sizeof(double));
    
    // Literal suffixes
    long longVal = 42L;
    unsigned int uVal = 42U;
    float floatVal = 3.14F;
    
    printf("\\nLiteral suffixes:\\n");
    printf("  42L = %ld\\n", longVal);
    printf("  42U = %u\\n", uVal);
    printf("  3.14F = %.2f\\n", floatVal);
    
    // Standard library functions
    printf("\\nStandard library:\\n");
    printf("  sqrt(16) = %.2f\\n", sqrt(16.0));
    printf("  String length of 'Hello': %zu\\n", strlen("Hello"));
    printf("  INT_MAX = %d\\n", INT_MAX);
    
    return 0;
}` },
  { name: "C++", id: "cpp", extension: ".cpp", monacoLang: "cpp", template: `#include <iostream>
#include <vector>
#include <string>
#include <memory>
#include <algorithm>

int main() {
    // Enhanced C++ compiler with modern standards support
    std::cout << "=== Enhanced C++ Compiler Demo ===" << std::endl;
    
    // Modern C++ features (C++11/14/17/20)
    auto message = std::string("Hello from C++!");
    std::cout << "Auto keyword: " << message << std::endl;
    
    // Smart pointers (C++11)
    auto ptr = std::make_unique<int>(42);
    std::cout << "Smart pointer value: " << *ptr << std::endl;
    
    // Container initialization (C++11)
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::cout << "Vector contents: ";
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Algorithm usage
    auto sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "Sum of vector: " << sum << std::endl;
    
    // Type sizes
    std::cout << "\\nType sizes:" << std::endl;
    std::cout << "  int: " << sizeof(int) << " bytes" << std::endl;
    std::cout << "  double: " << sizeof(double) << " bytes" << std::endl;
    std::cout << "  pointer: " << sizeof(void*) << " bytes" << std::endl;
    
    return 0;
}` },
  { name: "C#", id: "csharp", extension: ".cs", monacoLang: "csharp", template: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}` },
  { name: "Java", id: "java", extension: ".java", monacoLang: "java", template: `// Enhanced Java with GUI Support
// Choose between Console or GUI examples below

// === CONSOLE APPLICATION ===
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Java Console Application ===");
        System.out.println("Hello, World!");
        
        // Example with variables
        String message = "Welcome to OmniCode!";
        int number = 42;
        System.out.println("Message: " + message);
        System.out.println("Number: " + number);
        
        // Example with loops
        System.out.println("\\nCounting to 5:");
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}

/* === GUI APPLICATION EXAMPLE ===
// Uncomment the code below to create a GUI application
// The GUI will open in a new window when you run the code

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Main extends JFrame {
    private JLabel label;
    private JButton button;
    private JTextField textField;
    private int clickCount = 0;

    public Main() {
        setTitle("Java GUI Application - OmniCode");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new FlowLayout());

        // Create components
        label = new JLabel("Welcome to Java GUI!");
        textField = new JTextField("Type something here...", 20);
        button = new JButton("Click Me!");

        // Add action listener
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                clickCount++;
                label.setText("Button clicked " + clickCount + " times!");
                String text = textField.getText();
                JOptionPane.showMessageDialog(Main.this, 
                    "You typed: " + text + "\\nClick count: " + clickCount);
            }
        });

        // Add components to frame
        add(label);
        add(textField);
        add(button);

        // Set frame properties
        pack();
        setLocationRelativeTo(null);
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new Main();
            }
        });
    }
}
*/` },
  { name: "Go", id: "go", extension: ".go", monacoLang: "go", template: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}` },
  { name: "Rust", id: "rust", extension: ".rs", monacoLang: "rust", template: `fn main() {\n    println!("Hello, World!");\n}` },
  { name: "Ruby", id: "ruby", extension: ".rb", monacoLang: "ruby", template: `# Welcome to OmniCode\nputs "Hello, World!"` },
  { name: "PHP", id: "php", extension: ".php", monacoLang: "php", template: `<?php\necho "Hello, World!\\n";\n?>` },
  { name: "Swift", id: "swift", extension: ".swift", monacoLang: "swift", template: `print("Hello, World!")` },
  { name: "Kotlin", id: "kotlin", extension: ".kt", monacoLang: "kotlin", template: `fun main() {\n    println("Hello, World!")\n}` },
  { name: "Scala", id: "scala", extension: ".scala", monacoLang: "scala", template: `object Main extends App {\n    println("Hello, World!")\n}` },
  { name: "Dart", id: "dart", extension: ".dart", monacoLang: "dart", template: `void main() {\n  print('Hello, World!');\n}` },
  { name: "Lua", id: "lua", extension: ".lua", monacoLang: "lua", template: `print("Hello, World!")` },
  { name: "R", id: "r", extension: ".r", monacoLang: "r", template: `cat("Hello, World!\\n")` },
  { name: "Perl", id: "perl", extension: ".pl", monacoLang: "perl", template: `print "Hello, World!\\n";` },
  { name: "Haskell", id: "haskell", extension: ".hs", monacoLang: "haskell", template: `main = putStrLn "Hello, World!"` },
  { name: "Elixir", id: "elixir", extension: ".ex", monacoLang: "elixir", template: `IO.puts "Hello, World!"` },
  { name: "Clojure", id: "clojure", extension: ".clj", monacoLang: "clojure", template: `(println "Hello, World!")` },
  { name: "Erlang", id: "erlang", extension: ".erl", monacoLang: "erlang", template: `-module(hello).\n-export([main/0]).\n\nmain() ->\n    io:fwrite("Hello, World!~n").` },
  { name: "Julia", id: "julia", extension: ".jl", monacoLang: "julia", template: `println("Hello, World!")` },
  { name: "Bash", id: "bash", extension: ".sh", monacoLang: "shell", template: `#!/bin/bash\necho "Hello, World!"` },
  { name: "SQL", id: "sql", extension: ".sql", monacoLang: "sql", template: `SELECT 'Hello, World!' AS greeting;` },
  { name: "Assembly", id: "asm", extension: ".asm", monacoLang: "mips", template: `section .data\n    msg db "Hello, World!", 10\n    len equ $ - msg\n\nsection .text\n    global _start\n_start:\n    mov rax, 1\n    mov rdi, 1\n    mov rsi, msg\n    mov rdx, len\n    syscall\n    mov rax, 60\n    xor rdi, rdi\n    syscall` },
  { name: "Fortran", id: "fortran", extension: ".f90", monacoLang: "fortran", template: `program hello\n    print *, "Hello, World!"\nend program hello` },
  { name: "Pascal", id: "pascal", extension: ".pas", monacoLang: "pascal", template: `program Hello;\nbegin\n    writeln('Hello, World!');\nend.` },
  { name: "COBOL", id: "cobol", extension: ".cob", monacoLang: "cobol", template: `IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO.\nPROCEDURE DIVISION.\n    DISPLAY "Hello, World!".\n    STOP RUN.` },
  { name: "Zig", id: "zig", extension: ".zig", monacoLang: "zig", template: `const std = @import("std");\n\npub fn main() void {\n    std.debug.print("Hello, World!\\n", .{});\n}` },
  { name: "Nim", id: "nim", extension: ".nim", monacoLang: "nim", template: `echo "Hello, World!"` },
  { name: "OCaml", id: "ocaml", extension: ".ml", monacoLang: "ocaml", template: `let () = print_endline "Hello, World!"` },
  { name: "F#", id: "fsharp", extension: ".fs", monacoLang: "fsharp", template: `printfn "Hello, World!"` },
  { name: "Lisp", id: "lisp", extension: ".lisp", monacoLang: "lisp", template: `(format t "Hello, World!~%")` },
  { name: "Prolog", id: "prolog", extension: ".pl", monacoLang: "prolog", template: `:- initialization(main).\nmain :- write('Hello, World!'), nl.` },
  { name: "Solidity", id: "solidity", extension: ".sol", monacoLang: "sol", template: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract Hello {\n    function greet() public pure returns (string memory) {\n        return "Hello, World!";\n    }\n}` },
  { name: "JSON", id: "json", extension: ".json", monacoLang: "json", template: `{\n  "message": "Hello, World!",\n  "language": "JSON",\n  "version": "1.0"\n}` },
  { name: "XML", id: "xml", extension: ".xml", monacoLang: "xml", template: `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n    <message>Hello, World!</message>\n</root>` },
  { name: "YAML", id: "yaml", extension: ".yml", monacoLang: "yaml", template: `# Welcome to OmniCode\nmessage: "Hello, World!"\nlanguage: YAML\nversion: 1.0` },
  { name: "Markdown", id: "markdown", extension: ".md", monacoLang: "markdown", template: `# Hello, World!\n\nWelcome to **OmniCode**!\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n\`\`\`javascript\nconsole.log("Hello, World!");\n\`\`\`` },
  { name: "PowerShell", id: "powershell", extension: ".ps1", monacoLang: "powershell", template: `# Welcome to OmniCode\nWrite-Host "Hello, World!"` },
  { name: "VB.NET", id: "vbnet", extension: ".vb", monacoLang: "vb", template: `Module Program\n    Sub Main()\n        Console.WriteLine("Hello, World!")\n    End Sub\nEnd Module` },
  { name: "MATLAB", id: "matlab", extension: ".m", monacoLang: "matlab", template: `% Welcome to OmniCode\ndisp('Hello, World!')` },
];

export const languageCategories = [
  { letter: "Popular", langs: ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "HTML", "CSS"] },
  { letter: "Systems", langs: ["C", "C++", "Rust", "Zig", "Assembly", "Nim", "Go"] },
  { letter: "Web", langs: ["HTML", "CSS", "JavaScript", "TypeScript", "PHP", "Ruby", "Dart"] },
  { letter: "Functional", langs: ["Haskell", "Elixir", "Clojure", "Erlang", "OCaml", "F#", "Scala", "Lisp"] },
  { letter: "Scientific", langs: ["Python", "R", "Julia", "Fortran", "MATLAB", "COBOL"] },
  { letter: "Data", langs: ["SQL", "JSON", "XML", "YAML", "Markdown"] },
  { letter: "Scripting", langs: ["Bash", "PowerShell", "Lua", "Perl", "Ruby"] },
];
