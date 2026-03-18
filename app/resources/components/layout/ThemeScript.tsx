// This is a SERVER component that renders an inline blocking script
// Running before hydration prevents theme flashing and hydration mismatches
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const savedTheme = localStorage.getItem('theme');
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
              
              // Listen for theme changes from other tabs/windows
              window.addEventListener('storage', function(e) {
                if (e.key === 'theme') {
                  if (e.newValue === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
              });
            } catch (e) {
              console.error('Theme initialization failed:', e);
            }
          })();
        `,
      }}
    />
  );
}
