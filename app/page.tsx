import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import PostForm from './components/post-form';
import AnimatedGradientBackground from './components/AnimatedGradientBackground';
import { revalidatePath } from 'next/cache';

async function getMarkdownContent(username: string, repo: string) {
  const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/README.md`, {
    headers: {
      Accept: 'application/vnd.github.v3.raw',
      Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      'User-Agent': 'Themefisher-Assessment-App'
    },
    cache: 'no-store'
  });
  if (!response.ok) throw new Error('Failed to fetch Markdown content');
  return response.text();
}

export async function updateMarkdown(formData: FormData) {
  'use server';
  const username = formData.get('username') as string;
  const repo = formData.get('repo') as string;
  if (username && repo) {
    revalidatePath('/');
  }
}

export default async function Page() {
  const defaultUsername = 'salmansaymon57';
  const defaultRepo = 'ThemeFisher';
  const markdownContent = await getMarkdownContent(defaultUsername, defaultRepo);

  return (
    <div className="grid grid-cols-3 gap-x-10 gap-y-1 font-mono">
      <AnimatedGradientBackground />
      <div className="mt-15 ml-7 transition delay-150 col-span-2 min-h-[600px] max-h-[80vh] custom-scrollbar overflow-y-auto bg-white shadow-md rounded-md w-1.6 lg:max-w-screen mx-auto p-10" role="main" aria-label="Markdown Content and Post Management">
        <h1 className="text-2xl animate-pulse text-center font-bold mb-4">Markdown Content</h1>
        <form action={updateMarkdown} className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              name="username"
              defaultValue={defaultUsername}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="GitHub Username"
              aria-label="GitHub username"
            />
            <input
              type="text"
              name="repo"
              defaultValue={defaultRepo}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Repository Name"
              aria-label="Repository name"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              aria-label="Update Markdown content"
            >
              Update
            </button>
          </div>
        </form>
        <div className="prose">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{markdownContent}</ReactMarkdown>
        </div>
      </div>
      <PostForm />
    </div>
  );
}