import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { hydrateRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import type { Page } from '@inertiajs/core';
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
       if (el) {
           hydrateRoot(el, <App {...props} />);
       }
       return <App {...props} />;
   },
   withApp(app: ReactNode, { page }: { page: Page }): ReactNode {
       const flash = page.props.flash as Record<string, string> | undefined;
       if (flash) {
           return (
               <>
                   <FlashMessages {...flash} />
                   {app}
               </>
           );
       }
       return app;
   },
});
