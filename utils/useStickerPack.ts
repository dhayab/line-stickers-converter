import JSZip from 'jszip';
import { useCallback, useEffect, useState } from 'react';

type File = {
  name: string;
  blob: Blob;
};

type Meta = {
  name?: string;
  icon?: Blob;
  count?: number;
};

type State = 'loading' | 'loaded' | 'error' | 'invalid';

export function useStickerPack(packId: string | string[] | undefined) {
  const [files, setFiles] = useState<File[]>([]);
  const [meta, setMeta] = useState<Meta>({});
  const [state, setState] = useState<State>('loading');

  const isValidPackId = useCallback(() => {
    return !!packId && !Array.isArray(packId) && !!packId.match(/\d+/);
  }, [packId]);

  useEffect(() => {
    if (packId && !isValidPackId()) {
      setState('invalid');
    }
  }, [packId, isValidPackId]);

  useEffect(() => {
    if (state !== 'loading' || !isValidPackId()) {
      return;
    }

    const fetchZip = async () => {
      try {
        const packZipResource = await fetch(
          `https://stickershop.line-scdn.net/stickershop/v1/product/${packId}/iphone/stickers@2x.zip`
        );
        const zip = await JSZip.loadAsync(await packZipResource.arrayBuffer());

        const productInfo = JSON.parse(
          (await zip.file('productInfo.meta')?.async('string')) || '{}'
        );
        setMeta({
          name:
            productInfo.title.en ||
            productInfo.title.ja ||
            'Unnamed sticker pack',
          icon: await zip.file('tab_on@2x.png')?.async('blob'),
          count: productInfo.stickers.length,
        });

        setFiles(
          await Promise.all(
            zip
              .filter((_, file) => !!file.name.match(/(\d+)@2x/))
              .map((file) =>
                file.async('blob').then((blob) => ({ name: file.name, blob }))
              )
          )
        );

        setState('loaded');
      } catch (e) {
        setState('error');
      }
    };

    fetchZip();
  }, [state, packId, isValidPackId]);

  return {
    meta,
    files,
    state,
  };
}
