import sanitizeHtml from 'sanitize-html';

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

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Themefisher-Assessment-App',
        },
        body: JSON.stringify({
          message: `Add ${draft.title}`,
          content: btoa(content),
          branch: 'main',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to publish ${draft.title}: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to publish ${draft.title}: ${errorMessage}`);
    }
  }
};