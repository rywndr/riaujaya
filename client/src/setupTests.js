import '@testing-library/jest-dom';
import { vi } from 'vitest';

// global test setup 
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});