import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import {
  Affix,
  AppShell,
  Button,
  Container,
  Header,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { NotificationProps, useNotifications } from '@mantine/notifications';
import { RocketIcon } from '@modulz/radix-icons';

import StickerPackHeader from '../../components/StickerPackHeader';
import Sticker from '../../components/Sticker';
import { useStickerPack } from '../../utils/useStickerPack';
import { generateStickerDoodlePack } from '../../utils/createStickerDoodlePack';

export default function Pack() {
  const notifications = useNotifications();
  const notification = useRef<string | undefined>(undefined);

  const router = useRouter();
  const { id } = router.query;

  const { state, files, meta } = useStickerPack(id);

  const [converting, setConverting] = useState(false);
  const convert = async () => {
    setConverting(true);
    const pack = await generateStickerDoodlePack(
      files.map((file) => file.blob)
    );
    setConverting(false);
    const a = document.createElement('a');
    a.download = pack.name;
    a.href = URL.createObjectURL(pack.file);
    a.click();
  };

  const notify = (props: NotificationProps) => {
    if (!notification.current) {
      notification.current = notifications.showNotification({ ...props });
    } else {
      notifications.updateNotification(notification.current, {
        id: notification.current,
        ...props,
      });
    }
  };

  useEffect(() => {
    switch (state) {
      case 'loading':
        notify({
          loading: true,
          title: 'Loading',
          message: 'Retrieving sticker pack...',
          autoClose: false,
          disallowClose: true,
        });
        break;

      case 'loaded':
        notify({
          color: 'green',
          title: 'Done',
          message: 'Sticker pack retrieved successfully',
          autoClose: 3000,
        });
        break;

      case 'invalid':
      case 'error':
        notify({
          color: 'yellow',
          title: 'Oops',
          message: (
            <>
              <Text size="sm">
                {state === 'invalid'
                  ? 'The Line sticker pack ID is not valid'
                  : 'An error occurred while downloading the sticker pack'}
              </Text>
              <Button
                mt="sm"
                variant="light"
                color="yellow"
                onClick={() => router.back()}
              >
                Go back
              </Button>
            </>
          ),
          autoClose: 3000,
        });
        break;
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppShell
      fixed
      padding={0}
      header={
        <Header
          height={80}
          sx={{ backgroundColor: 'transparent', backdropFilter: 'blur(40px)' }}
        >
          <StickerPackHeader state={state} meta={meta} />
        </Header>
      }
    >
      {state === 'loaded' && (
        <Container mb={80}>
          <SimpleGrid cols={4} my="md">
            {files.map((file) => (
              <Sticker key={file.name} file={file} />
            ))}
          </SimpleGrid>
        </Container>
      )}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Button
          size="lg"
          radius="xl"
          leftIcon={<RocketIcon />}
          loading={converting}
          onClick={() => convert()}
        >
          Convert
        </Button>
      </Affix>
    </AppShell>
  );
}
