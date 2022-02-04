import bplist from 'bplist-creator';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';

export async function generateStickerDoodlePack(stickers: Blob[]) {
  const packName = `pack-line-${Date.now()}`;
  const zip = JSZip();

  const root = zip.folder(`${packName}.stkpack`)!;
  root.file('title.dat', createPlist('title'));

  const pack = root.folder('pack')!;
  stickers.forEach((blob, index) => {
    const folder = pack.folder(
      `${(index + 1)
        .toString()
        .padStart(4, '0')}-${uuidv4().toUpperCase()}.stickerdoodle`
    )!;

    folder.file('locdescription.dat', createPlist('locdescription'));
    folder.file('bgcolor.dat', createPlist('bgcolor'));
    folder.file('bordercolor.dat', createPlist('bordercolor'));
    folder.file('photo.dat', blob);
    folder.file('s.png', blob);
  });

  return {
    name: `${packName}.stkpackz`,
    file: await zip.generateAsync({ type: 'blob' }),
  };
}

function createPlist(template: string) {
  const templates: Record<string, any> = {
    title: {
      $objects: ['$null', 'Stickers'],
      $top: {
        Data: {
          CF$UID: 1,
        },
      },
    },
    locdescription: {
      $objects: [
        '$null',
        {
          $class: { CF$UID: 2 },
          'NS.string': '$null',
        },
        {
          $classes: ['NSString', 'NSObject'],
          $classname: 'NSString',
        },
      ],
      $top: {
        $data: { CF$UID: 1 },
      },
    },
    bgcolor: {
      $objects: [
        '$null',
        {
          $class: { CF$UID: 2 },
          NSColorSpace: 2,
          NSRGB: Buffer.from('1 1 1 0', 'utf-8'),
          UIColorComponentCount: 4,
          UIRed: new bplist.Real(1),
          UIGreen: new bplist.Real(1),
          UIBlue: new bplist.Real(1),
          UIAlpha: new bplist.Real(0),
        },
        {
          $classes: ['UIColor', 'NSObject'],
          $classhints: ['NSColor'],
          $classname: 'UIColor',
        },
      ],
      $top: {
        root: { CF$UID: 1 },
      },
    },
    bordercolor: {
      $objects: [
        '$null',
        {
          $class: { CF$UID: 2 },
          NSColorSpace: 4,
          NSWhite: Buffer.from('0.795', 'utf-8'),
          UIAlpha: new bplist.Real(1),
          UIWhite: new bplist.Real(0.79500001668930054),
          UIColorComponentCount: 2,
        },
        {
          $classes: ['UIColor', 'NSObject'],
          $classhints: ['NSColor'],
          $classname: 'UIColor',
        },
      ],
      $top: {
        root: { CF$UID: 1 },
      },
    },
  };

  return bplist({
    $archiver: 'NSKeyedArchiver',
    $version: 100000,
    ...templates[template],
  });
}
