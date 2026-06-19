import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { hydrateRoot } from 'react-dom/client';
import FlashMessages from '@/components/shared/FlashMessages';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
   title: (title) => (title ? `${title} - ${appName}` : appName),
   progress: {
      color: '#4B5563',
   },
   resolve: (name) => {
      const pagesTsx = import.meta.glob('./pages/**/*.tsx', { eager: true });
      const page = pagesTsx[`./pages/${name}.tsx`];

      if (!page) {
         return resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob('./pages/**/*.jsx'),
         );
      }

      return page;
   },
   setup({ el, App, props }) {
       const pageProps = props.initialPage.props || {};
       const flash = pageProps.flash as Record<string, string> | undefined;
       const content = (
          <>
             {flash && <FlashMessages {...flash} />}
             <App {...props} />
          </>
       );

       if (el) {
          hydrateRoot(el, content);
       }

       return content;
    },
});
