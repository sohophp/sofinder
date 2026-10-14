// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { FolderTree } from '../src/components/FolderTree';
import type { Api } from '../src/api';
import type { Entry } from '../src/types';
afterEach(cleanup);
it('refreshes cached directory branches after a filesystem mutation', async () => {
  let entries = [{ path: 'download', name: 'download', directory: true } as Entry];
  const api = { list: vi.fn(async () => ({ entries })) } as unknown as Api;
  const props = { api, resource: 'Files', currentPath: '', rootLabel: 'Home', onNavigate: vi.fn() };
  const view = render(<FolderTree {...props} revision={0}/>);
  await screen.findByText('download');
  entries = [{ path: 'certification', name: 'certification', directory: true } as Entry];
  view.rerender(<FolderTree {...props} revision={1}/>);
  await screen.findByText('certification');
  await waitFor(() => expect(screen.queryByText('download')).toBeNull());
});
