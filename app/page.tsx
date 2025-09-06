"use client"

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import PostForm from './components/post-form';

export default function Home() {
  const [markdownContent, setMarkdownContent] = useState<string>('Loading...');

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await axios.get('https://api.github.com/repos/salmansaymon57/eCommerce-NextJs/contents/README.md', {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
          },
        });
        setMarkdownContent(response.data);
      } catch (error) {
        setMarkdownContent('Failed to load Markdown content.');
      }
    };
    fetchMarkdown();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Markdown Content</h1>
      <div className="prose">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
      <PostForm />
    </div>
  );
}