import sanitizeHtml from 'sanitize-html';

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};


export const publishToGitHub = async (drafts: { id: number; title: string; body: string }[], repo: string, basePath: string, token: string) => {
  for (const draft of drafts) {
    const filePath = `${basePath}/${draft.title.replace(/ /g, '-')}.md`;
    const content = draft.body;

    const response = await fetch(`https://api.github.com/repos/${repo}/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Add ${draft.title}`,
        content: btoa(content),
        branch: 'main', // Adjust to your default branch
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to publish ${draft.title}: ${response.status} - ${errorText}`);
    }
  }
};