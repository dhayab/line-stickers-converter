import { useRouter } from 'next/router';

import {
  Anchor,
  Center,
  Group,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';

export default function Home() {
  const notifications = useNotifications();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      link: '',
    },
  });

  const handleFormSubmit = ({ link }: typeof form['values']) => {
    const packId = link.match(/stickershop\/product\/(?<id>\d+)\//)?.groups?.id;
    (packId && router.push(`pack/${packId}`)) ||
      notifications.showNotification({
        title: 'Oops',
        message: 'Please enter a valid Line sticker pack link',
        color: 'yellow',
        autoClose: 5000,
      });
  };

  return (
    <Center sx={{ minHeight: '-webkit-fill-available' }}>
      <Group position="center" direction="column" spacing="xl" mx="lg" grow>
        <Title align="center">
          <Text
            inherit
            variant="gradient"
            gradient={{ from: 'violet', to: 'grape' }}
            sx={{ fontWeight: 'bolder' }}
          >
            Line stickers converter
          </Text>
        </Title>
        <Text color="dimmed" size="md">
          This tool allows you to use{' '}
          <Anchor href="https://store.line.me/home" rel="nofollow">
            sticker packs from Line
          </Anchor>{' '}
          in iMessage by importing them to{' '}
          <Anchor
            href="https://apps.apple.com/us/app/sticker-doodle-draw-stickers/id1576281695"
            rel="nofollow"
          >
            Sticker Doodle
          </Anchor>
          .<Space h="xs" />
          To start, enter a Line sticker pack link in the box below:
        </Text>
        <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
          <TextInput
            size="lg"
            radius="xl"
            placeholder="https://store.line.me/stickershop/..."
            autoFocus
            enterKeyHint="send"
            {...form.getInputProps('link')}
          />
        </form>
      </Group>
    </Center>
  );
}
