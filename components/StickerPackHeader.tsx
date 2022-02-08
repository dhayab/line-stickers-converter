import { PropsWithChildren, useEffect, useState } from 'react';
import Link from 'next/link';

import {
  ActionIcon,
  Center,
  Container,
  Group,
  Image,
  Skeleton,
  Text,
} from '@mantine/core';
import { ChevronLeftIcon } from '@modulz/radix-icons';

import { useStickerPack } from '../utils/useStickerPack';

type Props = Pick<ReturnType<typeof useStickerPack>, 'meta' | 'state'>;

export default function StickerPackHeader({
  meta,
  state,
  children,
}: PropsWithChildren<Props>) {
  const [icon, setIcon] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && meta.icon) {
      setIcon(URL.createObjectURL(meta.icon));
    }
  }, [loading, meta]);

  useEffect(() => {
    state === 'loaded' && setLoading(false);
  }, [state]);

  return (
    <Container my="xs">
      <Group sx={{ justifyContent: 'space-between' }}>
        <Group spacing="xs">
          <Link href="/" passHref>
            <ActionIcon
              component="a"
              variant="hover"
              color="violet"
              radius="xl"
            >
              <ChevronLeftIcon />
            </ActionIcon>
          </Link>
          <Skeleton width={60} height={60} visible={loading}>
            {icon && <Image height={60} src={icon} alt={meta.name} />}
          </Skeleton>
          <Center>
            <Container padding={0}>
              <Skeleton visible={loading}>
                <Text weight="bold" size="sm">
                  {meta.name}
                </Text>
                <Text size="sm" color="dimmed">
                  {meta.count} stickers
                </Text>
              </Skeleton>
            </Container>
          </Center>
        </Group>
        {children}
      </Group>
    </Container>
  );
}
