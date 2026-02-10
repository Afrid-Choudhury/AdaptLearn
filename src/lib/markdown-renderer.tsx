import { Fragment } from 'react';

interface MarkdownProps {
  content: string;
}

interface Block {
  type: 'heading' | 'code' | 'paragraph' | 'list' | 'ordered-list' | 'blockquote' | 'hr';
  level?: number;
  lang?: string;
  items?: string[];
  text?: string;
}

function parseBlocks(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', lang: lang || undefined, text: codeLines.join('\n') });
      i++;
      continue;
    }

    if (/^#{1,6}\s/.test(line)) {
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        blocks.push({ type: 'heading', level: match[1].length, text: match[2] });
        i++;
        continue;
      }
    }

    if (/^---$|^\*\*\*$|^___$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    if (/^>\s/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join('\n') });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push({ type: 'ordered-list', items });
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ''));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('>') &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^---$|^\*\*\*$|^___$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join('\n') });
    }
  }

  return blocks;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      parts.push(
        <strong key={key++} className="font-bold italic">{match[2]}</strong>
      );
    } else if (match[3]) {
      parts.push(
        <strong key={key++} className="font-semibold text-gray-900">{match[3]}</strong>
      );
    } else if (match[4]) {
      parts.push(
        <em key={key++} className="italic">{match[4]}</em>
      );
    } else if (match[5]) {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 bg-slate-100 text-teal-700 rounded text-[0.875em] font-mono border border-slate-200">{match[5]}</code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      {lang && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{lang}</span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-600" />
            <div className="w-3 h-3 rounded-full bg-slate-600" />
            <div className="w-3 h-3 rounded-full bg-slate-600" />
          </div>
        </div>
      )}
      <div className="bg-slate-900 p-5 overflow-x-auto">
        <pre className="text-sm leading-relaxed font-mono text-slate-200 whitespace-pre">{code}</pre>
      </div>
    </div>
  );
}

export default function MarkdownContent({ content }: MarkdownProps) {
  const blocks = parseBlocks(content);

  return (
    <div className="lesson-content">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading': {
            const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
            const styles: Record<number, string> = {
              1: 'text-3xl font-bold text-gray-900 mt-10 mb-4 pb-3 border-b border-gray-200',
              2: 'text-2xl font-bold text-gray-900 mt-8 mb-3',
              3: 'text-xl font-semibold text-gray-800 mt-6 mb-2',
              4: 'text-lg font-semibold text-gray-800 mt-5 mb-2',
              5: 'text-base font-semibold text-gray-700 mt-4 mb-1',
              6: 'text-sm font-semibold text-gray-600 uppercase tracking-wide mt-4 mb-1',
            };
            return (
              <Tag key={idx} className={styles[block.level || 1]}>
                {renderInline(block.text || '')}
              </Tag>
            );
          }

          case 'code':
            return <CodeBlock key={idx} code={block.text || ''} lang={block.lang} />;

          case 'paragraph':
            return (
              <p key={idx} className="text-gray-700 leading-7 mb-4 text-[1.05rem]">
                {renderInline(block.text || '')}
              </p>
            );

          case 'list':
            return (
              <ul key={idx} className="my-4 ml-1 space-y-2">
                {block.items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 leading-7 text-[1.05rem]">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'ordered-list':
            return (
              <ol key={idx} className="my-4 ml-1 space-y-2 counter-reset-list">
                {block.items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 leading-7 text-[1.05rem]">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold flex items-center justify-center flex-shrink-0 border border-teal-200">
                      {i + 1}
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );

          case 'blockquote':
            return (
              <blockquote key={idx} className="my-6 pl-5 border-l-4 border-teal-400 bg-teal-50/50 py-4 pr-4 rounded-r-lg">
                <p className="text-gray-700 leading-7 italic">{renderInline(block.text || '')}</p>
              </blockquote>
            );

          case 'hr':
            return <hr key={idx} className="my-8 border-gray-200" />;

          default:
            return <Fragment key={idx} />;
        }
      })}
    </div>
  );
}
