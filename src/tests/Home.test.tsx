import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from '../components/Home'; // Adjust the import path to the actual location of your Home component

// Mocking fetch requests for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe('Home Component Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Home />);
  });

  it('displays posts correctly', async () => {
    const { getByText } = render(<Home />);

    // Mock posts data
    const mockPosts = [
      {
        _id: '1',
        creatorName: 'User 1',
        title: 'Post 1',
        creationDateTime: '2022-01-01T12:00:00Z',
        description: 'Description 1',
        likes: [],
        bookmarks: [],
        comments: [],
      },
      {
        _id: '2',
        creatorName: 'User 2',
        title: 'Post 2',
        creationDateTime: '2022-01-02T12:00:00Z',
        description: 'Description 2',
        likes: [],
        bookmarks: [],
        comments: [],
      },
    ];

    fetch.mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      })
    );

    await waitFor(() => {
      expect(getByText('Post 1 - Description 1')).toBeInTheDocument();
      expect(getByText('Post 2 - Description 2')).toBeInTheDocument();
    });
  });

  it('opens create post modal when "Create Post" button is clicked', async () => {
    const { getByText, getByRole } = render(<Home />);

    // Mock the fetchPosts function
    const originalFetchPosts = Home.prototype.fetchPosts;
    Home.prototype.fetchPosts = jest.fn();

    fireEvent.click(getByRole('button', { name: 'Create Post' }));

    await waitFor(() => {
      expect(getByText('Create New Post')).toBeInTheDocument();
    });

    Home.prototype.fetchPosts = originalFetchPosts; // Restore the original function
  });

  // You can write similar test cases for other interactions and functions in the component
});
