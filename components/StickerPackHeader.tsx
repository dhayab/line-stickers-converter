import {
  ActionIcon,
  Anchor,
  Center,
  Container,
  Group,
  Image,
  Skeleton,
  Text,
  ThemeIcon,
  useMantineColorScheme,
} from '@mantine/core';
import {
  ChevronLeftIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
} from '@modulz/radix-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStickerPack } from '../utils/useStickerPack';

type Props = Pick<ReturnType<typeof useStickerPack>, 'meta' | 'state'>;

export default function StickerPackHeader({ meta, state }: Props) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
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
            <ThemeIcon variant="light" color="violet">
              <ChevronLeftIcon />
            </ThemeIcon>
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
        <ActionIcon
          variant="outline"
          color={colorScheme === 'light' ? 'blue' : 'yellow'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {colorScheme === 'light' ? <MoonIcon /> : <SunIcon />}
        </ActionIcon>
      </Group>
    </Container>
  );
}
