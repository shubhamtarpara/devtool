# DevUtils - Developer Utilities Toolkit

![DevUtils](https://via.placeholder.com/1200x300?text=DevUtils)

DevUtils is a comprehensive collection of developer tools designed to streamline your workflow. This web application provides a wide range of utilities for encoding, decoding, formatting, and transforming data in various formats.

## 🚀 Features

DevUtils includes the following tools:

### 🔄 Encoders/Decoders

- **Base64 Encoder/Decoder**: Convert text to and from Base64 encoding
- **Base64 Image Converter**: Convert images to and from Base64 format
- **URL Encoder/Decoder**: Encode and decode URL components
- **HTML Encoder/Decoder**: Convert HTML special characters to and from their entity representations

### 📝 Formatters

- **JSON Formatter**: Format and validate JSON with pretty print or compact options
- **Markdown Preview**: Live preview of Markdown with support for GitHub Flavored Markdown
- **Text Diff**: Compare two text blocks and highlight differences

### 🔍 Parsers & Analyzers

- **JWT Decoder**: Decode and inspect JWT tokens
- **URL Parser**: Parse and analyze URL components
- **Word Counter**: Count characters, words, lines, and paragraphs in text

### 🎲 Generators

- **UUID Generator**: Generate random UUIDs
- **Hash Generator**: Create SHA-256, SHA-384, and SHA-512 hashes
- **Lorem Ipsum Generator**: Generate placeholder text

### 🔄 Converters

- **Unix Time Converter**: Convert between dates and Unix timestamps
- **Number Base Converter**: Convert between binary, octal, decimal, and hexadecimal
- **Color Converter**: Convert between HEX, RGB, and HSL color formats
- **Case Converter**: Transform text between different case styles (upper, lower, title, camel, snake, kebab, pascal)

### 🧰 Other Tools

- **Regex Tester**: Test and debug regular expressions with real-time highlighting

## 🖥️ Screenshots

![DevUtils Screenshot](https://via.placeholder.com/800x450?text=DevUtils+Screenshot)

## 🛠️ Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/devutils.git
cd devutils
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Building for Production

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
```

## 🧩 Project Structure

```
/src
├── /app                  # Next.js app directory
│   ├── /globals.css      # Global styles
│   ├── /layout.jsx       # Root layout component
│   └── /page.jsx         # Home page component
├── /components           # React components
│   ├── /ToolSelector.jsx # Main tool selection component
│   └── /tools            # Individual tool components
└── /utils                # Utility functions
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-rendered applications
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Icon library

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- All the open-source libraries that made this project possible
- The developer community for continuous inspiration

## 🔮 Future Enhancements

- Add more developer tools
- Implement dark mode
- Add ability to save tool configurations
- Create a PWA version for offline use
- Add user accounts to save preferences
