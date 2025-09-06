import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import PostForm from './components/post-form';

async function getMarkdownContent() {
  const response = await fetch('https://api.github.com/repos/salmansaymon57/ThemeFisher/contents/README.md', {
    headers: {Accept: 'application/vnd.github.v3.raw', 'User-Agent': 'Themefisher-Assessment-App'},
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch Markdown content');
  return response.text();
}

export default async function Page() {
  const markdownContent = await getMarkdownContent();

  return (
    <div className="container mx-auto p-4" role="main" aria-label="Markdown Content and Post Management">
      <h1 className="text-2xl font-bold mb-4">Markdown Content</h1>
      <div className="prose">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{markdownContent}</ReactMarkdown>
      </div>
      <PostForm />
    </div>
  );
}