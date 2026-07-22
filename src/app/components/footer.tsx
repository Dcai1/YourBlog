export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-center py-4 mt-5 z-3">
      <p className="mb-0">© {currentYear} YourBlog. All rights reserved.</p>
    </footer>
  );
};
