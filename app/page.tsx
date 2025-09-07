import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import PostForm from './components/post-form';
import AnimatedGradientBackground from './components/AnimatedGradientBackground';

async function getMarkdownContent() {
  const response = await fetch('https://api.github.com/repos/salmansaymon57/ThemeFisher/contents/README.md', {
    headers: {Accept: 'application/vnd.github.v3.raw', 
              Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              'User-Agent': 'Themefisher-Assessment-App'},
             
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch Markdown content');
  return response.text();
}


export default async function Page() {
  const markdownContent = await getMarkdownContent();
  
  return (
    <div className="grid grid-cols-3 gap-x-10 gap-y-1">
    <AnimatedGradientBackground />
    <div className="mt-15 ml-7 col-span-2 min-h-[600px] max-h-[80vh]  custom-scrollbar overflow-y-auto bg-white shadow-md rounded-md w-1.6 lg:max-w-screen mx-auto  p-10" role="main" aria-label="Markdown Content and Post Management">
      <h1 className="text-2xl font-bold mb-4">Markdown Content</h1>
      <div className="prose">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{markdownContent}</ReactMarkdown>
      </div>
    </div>
    <PostForm />
    </div>
  );
}