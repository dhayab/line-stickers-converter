import { Image, Paper } from '@mantine/core';
import { useStickerPack } from '../utils/useStickerPack';

type Props = {
  file: ReturnType<typeof useStickerPack>['files'][0];
};

export default function Sticker({ file }: Props) {
  return (
    <Paper>
      <Image src={URL.createObjectURL(file.blob)} alt={file.name} />
    </Paper>
  );
}
