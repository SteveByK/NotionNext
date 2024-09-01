import KaTeX from 'katex'
import React, { memo, useEffect, useState, ElementType } from 'react'

interface TeXProps {
  children?: string;
  math?: string;
  block?: boolean;
  errorColor?: string;
  renderError?: (error: Error) => React.ReactNode;
  settings?: KaTeX.KatexOptions;
  as?: ElementType;
  [key: string]: any;
}

interface TeXState {
  innerHtml?: string;
  errorElement?: React.ReactNode;
}

const TeX: React.FC<TeXProps> = memo(({
  children,
  math,
  block = false,
  errorColor,
  renderError,
  settings,
  as: Component = block ? 'div' : 'span',
  ...props
}) => {
  const content = children ?? math;
  const [state, setState] = useState<TeXState>({});

  useEffect(() => {
    try {
      const innerHtml = KaTeX.renderToString(content ?? '', {
        displayMode: block,
        errorColor,
        throwOnError: !!renderError,
        ...settings
      });

      setState({ innerHtml });
    } catch (error) {
      if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
        if (renderError) {
          setState({ errorElement: renderError(error) });
        } else {
          setState({ innerHtml: error.message });
        }
      } else {
        throw error;
      }
    }
  }, [block, content, errorColor, renderError, settings]);

  if (state.errorElement) {
    return state.errorElement as React.ReactElement;
  }

  return (
    <Component
      {...props}
      dangerouslySetInnerHTML={{ __html: state.innerHtml ?? '' }}
    />
  );
});

TeX.displayName = 'TeX';

export default TeX;