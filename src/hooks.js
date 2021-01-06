import { useState } from 'preact/hooks';
import { useQuery, useSubscription as useSubscriptionUrql } from '@urql/preact';

export function useTwitchChannelInfo(channel) {
  if (!channel) {
    throw new Error('useTwitchChannelInfo requires a channel to be set');
  }

  const [result] = useQuery({
    query: `
      query TwitchChannelInfo ($channel: String!) {
        channel(username: $channel) {
          username
          status
          stream {
            title
            startTime
          }
        }
      }
    `,
    variables: { channel },
  });

  return result;
}

export function useTwitchChat(channel) {
  const [chat, setChat] = useState([]);
  const [events, setEvents] = useState([]);
  const [commands, setCommands] = useState([]);
  const [currentCommand, setCurrentCommand] = useState();

  if (!channel) {
    throw new Error('useTwitchChat requires a channel to be set');
  }

  const useSubscription =
    typeof window !== 'undefined' ? useSubscriptionUrql : () => [{}];

  useSubscription(
    {
      query: `
        subscription TwitchMessages ($channel: String!) {
          message(channel: $channel) {
            time
            emotes {
              name
              locations
              images {
                large
              }
            }

            ... on TwitchChatCommand {
              command
              args
              handler {
                message
                audio
                image
                duration
              }
            }

            ... on TwitchChatMessage {
              html
            }
    
            ... on TwitchChatEvent {
              type
              details
            }

            message
            author {
              username
              roles
            }
          }
        }
      `,
      variables: { channel },
    },
    (_, response) => {
      if (response.message.command) {
        setCommands([...commands, response.message]);
        setCurrentCommand(response.message);
      } else if (response.message.type) {
        setEvents([...events, response.message]);
      } else {
        setChat([...chat, response.message]);
      }
    },
  );

  return { chat, commands, events, currentCommand };
}
