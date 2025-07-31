# Development Setup Guide for CommitKings

Welcome! This guide will help you set up CommitKings for local development and contribution.

---

## 1. Prerequisites

- **Node.js**: v18.17.0 or higher
- **pnpm**: Latest version (install via `npm i -g pnpm`)
- **Git**: For version control
- **Supabase Account**: For database and authentication (https://supabase.com)

---

## 2. Fork and Clone the Repository

1. Fork the repo on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CommitKing.git
   cd CommitKing
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/Rajesh-Royal/CommitKing.git
   ```

---

## 3. Install Dependencies

```bash
pnpm install
```

---

## 4. Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Supabase credentials and any other required values in `.env.local`.

---

## 5. Database Setup

1. Push the schema to your Supabase project:
   ```bash
   pnpm db:push
   ```
2. Seed the database with priority profiles/repos:
   ```bash
   N/A, profiles are stored in constant file
   ```
3. (Optional) Open Drizzle Studio for DB inspection:
   ```bash
   pnpm db:studio
   ```

---

## 6. Start the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Code Quality & Pre-commit Hooks

- Lint code: `pnpm lint`
- Fix lint errors: `pnpm lint:fix`
- Format code: `pnpm format`
- Type check: `pnpm type-check`
- Pre-commit hooks run automatically (Husky + lint-staged)

---

## 8. Running Tests

- (Add test instructions here if/when tests are available)

---

## 9. Useful Scripts

- `pnpm build` – Build for production
- `pnpm start` – Start production server
- `pnpm db:generate` – Generate DB migrations

---

## 10. Troubleshooting

- If you have issues, check your Node.js and pnpm versions
- Ensure your `.env.local` is correctly configured
- Check open issues or discussions for help

---

## 11. Resources

- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Project README](README.md)

---

Happy coding! 🎉
