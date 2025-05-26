export const Footer: React.FC = () => {
  return (
    <footer className="py-2 w-full border-t border-gray-200 dark:border-gray-800 bg-background">
      <p className="text-xs text-muted-foreground text-center">
        Decentralized Poll. Made by{' '}
        <a
          href="https://linkedin.com/in/enzo-candotti"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-black dark:hover:text-white"
        >
          Novalya Labs
        </a>
      </p>
    </footer>
  );
};
