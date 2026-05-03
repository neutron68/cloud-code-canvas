# Java Execution Guide - OmniCode

## Overview
OmniCode now supports executing Java code with an enhanced interpreter that can handle:
- Variable declarations and assignments
- Object creation and method calls
- String concatenation
- Console output with System.out.println()
- Both console and GUI applications

## How It Works

### 1. **Console Applications**
The Java interpreter executes your code by:
- Parsing variable declarations (int, String, double, etc.)
- Tracking object creation with constructors
- Executing method calls (setters/getters)
- Evaluating expressions in System.out.println()

### 2. **Example: Books Class**

```java
class Books {
    private String title;
    private String author;
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public String getTitle() {
        return this.title;
    }
    
    public String getAuthor() {
        return this.author;
    }
}

public class Main {
    public static void main(String[] args) {
        Books book1 = new Books();
        book1.setTitle("The Alchemist");
        book1.setAuthor("Paulo Coelho");
        
        Books book2 = new Books();
        book2.setTitle("Spider-Man");
        book2.setAuthor("Stan Lee");
        
        System.out.println("Book Title: " + book1.getTitle());
        System.out.println("Author Name: " + book1.getAuthor());
        System.out.println("Book Title: " + book2.getTitle());
        System.out.println("Author Name: " + book2.getAuthor());
    }
}
```

**Expected Output:**
```
Book Title: The Alchemist
Author Name: Paulo Coelho
Book Title: Spider-Man
Author Name: Stan Lee

[Java process completed in 0.758s with 812KB memory usage]
```

### 3. **GUI Applications**

For GUI applications using Swing/AWT, the system:
- Automatically detects GUI components (JFrame, JButton, etc.)
- Opens a new browser window with a simulated GUI
- Provides interactive components

**Example GUI Code:**
```java
import javax.swing.*;
import java.awt.*;

public class Main extends JFrame {
    public Main() {
        setTitle("My Java App");
        JButton button = new JButton("Click Me!");
        add(button);
        setVisible(true);
    }
    
    public static void main(String[] args) {
        new Main();
    }
}
```

## Features

### ✅ Supported Java Features
- Variable declarations (int, String, double, float, boolean, char)
- Object instantiation with `new` keyword
- Method calls (setters and getters)
- String concatenation with `+`
- System.out.println() and System.out.print()
- Multiple objects and variables
- GUI detection and window creation

### ⚠️ Current Limitations
- Complex expressions and operators (arithmetic, logical)
- Arrays and collections (ArrayList, HashMap, etc.)
- Loops (for, while) - partially supported
- Conditionals (if/else) - not yet supported
- Exception handling (try/catch)
- Static methods beyond main()
- Inheritance and polymorphism

## Improving Accuracy

To get the most accurate output:

1. **Use Simple Patterns**: The interpreter works best with straightforward code
2. **Follow Conventions**: Use standard getter/setter naming (getTitle, setTitle)
3. **Explicit Output**: Use System.out.println() for all output
4. **String Concatenation**: Use `+` operator for combining strings

## Cloud Execution (Recommended)

For 100% accurate Java execution, configure the Judge0 API:

1. Get a Judge0 API key from RapidAPI
2. Set the `JUDGE0_API_KEY` environment variable in Supabase
3. The system will automatically use cloud execution when available

With cloud execution, you'll get:
- Real JVM compilation and execution
- Full Java language support
- Accurate error messages
- Standard library access

## Troubleshooting

### Issue: Output shows `[variable_name]` instead of values
**Solution**: The interpreter couldn't parse the variable. Make sure:
- Variables are declared in the main method
- Getter methods follow naming convention (getPropertyName)
- String concatenation uses proper syntax

### Issue: GUI window doesn't open
**Solution**: Check that:
- Popups are allowed in your browser
- Code contains Swing/AWT imports
- JFrame or GUI components are present

### Issue: Cloud execution fails
**Solution**: 
- The system falls back to local interpretation
- Configure Judge0 API key for cloud execution
- Check your internet connection

## Next Steps

The Java interpreter is continuously being improved. Future updates will include:
- Full loop and conditional support
- Array and collection handling
- More complex expressions
- Better error messages
- Enhanced GUI simulation
