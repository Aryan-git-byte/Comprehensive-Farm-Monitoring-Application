declare module 'react-helmet-async' {
  import * as React from 'react';

  export interface HelmetProviderProps {
    children?: React.ReactNode;
    context?: Record<string, unknown>;
  }

  export const HelmetProvider: React.FC<HelmetProviderProps>;

  export interface HelmetProps {
    children?: React.ReactNode;
  }

  export const Helmet: React.FC<HelmetProps>;
}
