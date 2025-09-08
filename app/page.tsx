// page.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import PostForm from './components/post-form';
import EditModal from './components/EditModal';
import AnimatedGradientBackground from './components/AnimatedGradientBackground';
import { updateMarkdown, loadDrafts } from '../app/actions';
import { kv } from '@vercel/kv';

async function getMarkdownContent(username: string, repo: string, token: string, file: string) {
  if (!username || !repo || !token || !file) {
    return '# No Repository or File Specified\nPlease provide a GitHub username, repository name, personal access token, and Markdown file name.';
  }
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${file}`, {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        Authorization: `token ${token}`,
        'User-Agent': 'Themefisher-Assessment-App',
      },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Failed to fetch Markdown content: ${response.statusText}`);
    return await response.text();
  } catch (error) {
    return `# Error Fetching Markdown\n${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

const SUCCESS_FLAG_KEY = 'success_flag';

export default async function Page(
  props: { searchParams: Promise<{ username?: string; repo?: string; token?: string; file?: string; editDraftId?: string; cancelEdit?: string }> }
) {
  const searchParams = await props.searchParams;
  const username = searchParams.username || '';
  const repo = searchParams.repo || '';
  const token = searchParams.token || '';
  const file = searchParams.file || '';
  const editDraftId = searchParams.editDraftId ? Number(searchParams.editDraftId) : undefined;
  const cancelEdit = searchParams.cancelEdit === 'true';

  const markdownContent = await getMarkdownContent(username, repo, token, file);
  const drafts = await loadDrafts();
  const selectedDraft = editDraftId && !cancelEdit ? drafts.find((draft) => draft.id === editDraftId) : null;

  try {
    const flag = await kv.get<string>(SUCCESS_FLAG_KEY);
    if (flag) {
      await kv.del(SUCCESS_FLAG_KEY);
      // Optionally: Add a success message to UI here if needed
    }
  } catch (error) {
    console.error('Error handling success flag:', error);
  }

  return (
    <div>
      <AnimatedGradientBackground />
      <div>
        <h1 className="text-2xl animate-pulse text-center font-bold mt-5">GITHUB-MARKDOWN-MANAGER</h1>
      </div>
      <div className="grid grid-cols-3 gap-x-10 gap-y-1 font-mono" role="main" aria-label="Markdown Content and Post Management">
        <div className="mt-5 ml-7 transition delay-150 col-span-2 min-h-[600px] max-h-[80vh] custom-scrollbar overflow-y-auto bg-white/30 shadow-md rounded-md w-1.6 lg:max-w-screen mx-auto p-10">
          <h1 className="text-2xl text-center font-bold mb-4">Fetch your GitHub repository&apos;s markdown content</h1>
          <form action={updateMarkdown} className="mb-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">GitHub Username</label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={username}
                className="mt-1 block w-full bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="repo" className="block text-sm font-medium text-gray-700">Repository Name</label>
              <input
                type="text"
                id="repo"
                name="repo"
                defaultValue={repo}
                className="mt-1 block w-full bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">Personal Access Token</label>
              <input
                type="password"
                id="token"
                name="token"
                defaultValue={token}
                className="mt-1 block w-full bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">Markdown File Name</label>
              <input
                type="text"
                id="file"
                name="file"
                defaultValue={file || 'README.md'}
                placeholder="e.g., README.md or example.md"
                className="mt-1 block w-full bg-amber-100 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Fetch Markdown content"
            >
              Fetch Markdown
            </button>
          </form>
          <div className="prose border border-black mx-auto p-6 rounded-lg">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{markdownContent}</ReactMarkdown>
          </div>
        </div>
        <div>
          <PostForm githubParams={{ username, repo, token }} editDraftId={editDraftId} />
          {selectedDraft && <EditModal draft={selectedDraft} />}
        </div>
      </div>
    </div>
  );
}