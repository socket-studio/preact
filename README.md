# React Tools for Socket Studio

Wrap the parts of your app that need Socket Studio access in the provider:

```jsx
import { createSocketStudioClient, SocketStudioProvider } from '@socket-studio/preact';

export function MyAppWrapper({ children }) {
  const url = 'https://api.streamblitz.com/graphql';
  const client = createSocketStudioClient(url);

  return (
    <SocketStudioProvider client={client}>
      {children}
    </SocketStudioProvider>
  )
}
```

In any component wrapped by the provider, you can access Twitch chat data like so:

```jsx
import { useTwitchChat } from '@socket-studio/preact';

export function MyChat() {
  const twitchChannel = 'jlengstorf';
  const { chat, commands, currentCommand } = useTwitchChat(twitchChannel);

  return (
    <pre>{JSON.stringify({ chat, commands, currentCommand }, null, 2)}</pre>
  )
}
```
