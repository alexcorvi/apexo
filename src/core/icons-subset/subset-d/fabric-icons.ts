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
      src: `url('${baseUrl}fabric-icons-97f9e4b6.woff') format('woff')`
    },
    icons: {
      'Mail': '\uE715',
      'Phone': '\uE717',
      'Lock': '\uE72E',
      'Permissions': '\uE8D7'
    }
  };

  registerIcons(subset, options);
}
