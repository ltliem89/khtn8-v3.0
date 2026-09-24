import React, { useMemo } from 'react';
import katex from 'katex';
import { sanitizeLatex, normalizeFormula, autoWrapMathInText } from '../utils/mathEngine';

interface MathViewProps {
  math?: string;
  latex?: string;
  text?: string;
  children?: string;
  block?: boolean;
  className?: string;
}

/**
 * Standard MathView component using KaTeX.
 * Features:
 * 1. Renders fractions \frac{...}{...} properly as true mathematical fractions.
 * 2. Handles Vietnamese decimal comma notation (24,79 -> 24{,}79) and dots (24.79).
 * 3. Handles both inline \(\frac{V}{24.79}\) and block $$ = \frac{V}{24{,}79} $$.
 * 4. Handles variable formulas like \(V = 24.79n\) and \(V = 24,79n\).
 * 5. Sanitizes corrupted control character escapes (\u000c form feed, \u0008 backspace, etc.).
 * 6. Prevents raw LaTeX from ever leaking into the DOM.
 */
export const MathView: React.FC<MathViewProps> = ({
  math,
  latex,
  text,
  children,
  block = false,
  className = ''
}) => {
  const rawContent = (math ?? latex ?? text ?? children ?? '').trim();

  // Helper to safely render LaTeX with KaTeX
  const renderTex = (tex: string, isBlock: boolean): string => {
    const cleanTex = sanitizeLatex(tex);
    try {
      let html = katex.renderToString(cleanTex, {
        displayMode: isBlock,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml'
      });

      // If KaTeX rendered with an error indicator, attempt normalization recovery
      if (html.includes('class="katex-error"')) {
        const normalized = normalizeFormula(cleanTex);
        const retryHtml = katex.renderToString(normalized, {
          displayMode: isBlock,
          throwOnError: false,
          strict: false,
          output: 'htmlAndMathml'
        });
        if (!retryHtml.includes('class="katex-error"')) {
          html = retryHtml;
        }
      }
      return html;
    } catch {
      // Clean fallback if completely unparseable
      return `<span class="font-mono text-slate-800">${escapeHtml(tex)}</span>`;
    }
  };

  // Determine if the string is primarily a mathematical formula rather than long prose
  const isPureFormula = (str: string): boolean => {
    const s = str.trim();
    if (!s) return false;

    // Check if there are Vietnamese prose words outside of \text{...}
    const strippedOfText = s.replace(/\\text\{[^{}]*\}/g, '');
    const hasVietnameseProse = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
      strippedOfText
    );
    if (hasVietnameseProse) {
      return false;
    }

    // Common LaTeX math commands & symbols
    if (
      s.startsWith('=') ||
      s.includes('\\frac') ||
      s.includes('\\cdot') ||
      s.includes('\\times') ||
      s.includes('\\Delta') ||
      s.includes('\\sqrt') ||
      s.includes('_{') ||
      s.includes('^{') ||
      s.includes('\\text{') ||
      s.includes('\\quad') ||
      s.includes('\\approx') ||
      s.includes('\\iff') ||
      s.includes('\\rightarrow') ||
      s.includes('\\le') ||
      s.includes('\\ge') ||
      s.includes('\\ne') ||
      s.includes('\\pm') ||
      s.includes('\\%') ||
      s.includes('\\pi')
    ) {
      return true;
    }
    // Assignment or equation without long prose
    if (s.includes('=') || s.includes('/') || s.includes('*')) {
      return true;
    }
    return false;
  };

  const parsed = useMemo(() => {
    if (!rawContent) return { html: '', isBlock: block };

    const sanitized = sanitizeLatex(rawContent);

    // Case 1: Pure block math (wrapped in $$ ... $$ or \[ ... \]) OR explicitly requested as block
    if (
      block ||
      (sanitized.startsWith('$$') && sanitized.endsWith('$$')) ||
      (sanitized.startsWith('\\[') && sanitized.endsWith('\\]'))
    ) {
      let inner = sanitized;
      if (inner.startsWith('$$') && inner.endsWith('$$')) {
        inner = inner.slice(2, -2).trim();
      } else if (inner.startsWith('\\[') && inner.endsWith('\\]')) {
        inner = inner.slice(2, -2).trim();
      }
      return { html: renderTex(inner, true), isBlock: true };
    }

    // Case 2: Pure inline math wrapped in \( ... \) or $ ... $
    if (
      (sanitized.startsWith('\\(') && sanitized.endsWith('\\)')) ||
      (sanitized.startsWith('$') && sanitized.endsWith('$') && !sanitized.slice(1, -1).includes('$'))
    ) {
      const inner = sanitized.startsWith('\\(')
        ? sanitized.slice(2, -2).trim()
        : sanitized.slice(1, -1).trim();
      return { html: renderTex(inner, false), isBlock: false };
    }

    // Case 3: Pure formula without delimiters (e.g. \frac{V}{24.79}, = \frac{V}{24{,}79}, V = 24.79n, etc.)
    if (isPureFormula(sanitized)) {
      const rendered = renderTex(sanitized, false);
      if (!rendered.includes('class="katex-error"')) {
        return { html: rendered, isBlock: false };
      }
    }

    // Case 4: Mixed text with embedded $...$, $$...$$, \(...\), or \[...\]
    // If text does not already contain delimiters, intelligently wrap math expressions
    const textToProcess = autoWrapMathInText(sanitized);
    const mathRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\(.+?\\\)|\$[^\$\n]+?\$)/g;
    const parts = textToProcess.split(mathRegex);

    const mappedHtml = parts
      .map((part) => {
        if (!part) return '';
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const inner = part.slice(2, -2).trim();
          return `<div class="my-2 overflow-x-auto text-center">${renderTex(inner, true)}</div>`;
        }
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          const inner = part.slice(2, -2).trim();
          return `<div class="my-2 overflow-x-auto text-center">${renderTex(inner, true)}</div>`;
        }
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          const inner = part.slice(2, -2).trim();
          return renderTex(inner, false);
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const inner = part.slice(1, -1).trim();
          return renderTex(inner, false);
        }
        return escapeHtml(part);
      })
      .join('');

    return { html: mappedHtml, isBlock: false };
  }, [rawContent, block]);

  if (!rawContent) return null;

  if (parsed.isBlock) {
    return (
      <div
        className={`katex-block-wrapper overflow-x-auto py-2 text-center select-text ${className}`}
        dangerouslySetInnerHTML={{ __html: parsed.html }}
      />
    );
  }

  return (
    <span
      className={`katex-inline-wrapper inline-block align-baseline select-text ${className}`}
      dangerouslySetInnerHTML={{ __html: parsed.html }}
    />
  );
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
