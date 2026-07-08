# Blog Platform

Full-stack blogging application built with Next.js 15 (App Router), React 19, TypeScript, PostgreSQL, and Prisma ORM. Features account creation, session-based authentication, rich-text content creation, and a draft/publish workflow.

## Tech Stack

| Layer        | Technology                       |
| ------------ | -------------------------------- |
| Framework    | Next.js 15 (App Router)          |
| Frontend     | React 19, TypeScript             |
| Styling      | Bootstrap 5, Sass (SCSS)         |
| Rich Text    | Quill (react-quill-new)          |
| Sanitization | Sanitize-html                    |
| Database     | PostgreSQL                       |
| ORM          | Prisma                           |
| Auth         | bcryptjs + custom session tokens |

## Features

- **User accounts** — Registration, login/logout, session-based authentication
- **Blog CRUD** — Create, read, update, and delete blog posts with a rich text editor
- **Draft/publish workflow** — Toggle published status; drafts are private to their author
- **Public blog listing** — Only published posts are visible to visitors
- **Dashboard** — Manage your own posts from a centralized view
- **Responsive UI** — Bootstrap 5 with custom Sass styling

## Security

- Server-side session auth with httpOnly, sameSite cookies
- Post sanitization using the sanitize-html library
- bcrypt password hashing (12 rounds)
- Generic login errors to prevent email enumeration
- Session expiration and auto-cleanup
- Author ownership enforcement on all write/delete API routes (403 for unauthorized requests)
- Draft privacy — unpublished posts return 404 for non-authors
- Server-side input validation and duplicate submission detection
- Session identity derived from server, not from client-supplied parameters

## Project Status

**(Almost)** Production-ready MVP. Still requires a couple of tweaks and a modernized front-end layout before I can truly consider it ready for production. Core security and ownership semantics are hardened. Ongoing improvements including XSS sanitization for rich content, enhanced server-side validation, dynamic metadata, and SEO optimization are in the works!
