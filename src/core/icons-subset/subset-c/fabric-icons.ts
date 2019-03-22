  // Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license

// tslint:disable:max-line-length

import {
  IIconOptions,
  IIconSubset,
  registerIcons
} from '@uifabric/styling';

export function initializeIcons(
  baseUrl: string = '',
  options?: IIconOptions
): void {
  const subset: IIconSubset = {
    style: {
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontStyle: 'normal',
      fontWeight: 'normal',
      speak: 'none'
    },
    fontFace: {
      fontFamily: `"FabricMDL2Icons"`,
      src: `url('${baseUrl}fabric-icons-25b0f596.woff') format('woff')`
    },
    icons: {
      'MiniLink': '\uE732',
      'ReadingMode': '\uE736',
      'PhotoCollection': '\uE7AA',
      'Previous': '\uE892',
      'Next': '\uE893',
      'Timer': '\uE91E',
      'AllCurrency': '\uEAE4',
      'Photo2': '\uEB9F',
      'Photo2Add': '\uECAB',
      'Photo2Remove': '\uECAC',
      'GroupedList': '\uEF74',
      'EditPhoto': '\uEF77',
      'Database': '\uEFC7',
      'ZipFolder': '\uF012',
      'FabricOpenFolderHorizontal': '\uF0A8',
      'BufferTimeAfter': '\uF0D0',
      'BufferTimeBoth': '\uF0D1',
      'TripleColumn': '\uF1D5',
      'LocaleLanguage': '\uF2B7',
      'Teeth': '\uF4A0',
      'DatabaseSync': '\uF842'
    }
  };

  registerIcons(subset, options);
}
