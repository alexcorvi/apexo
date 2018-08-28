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
      src: `url('${baseUrl}fabric-icons-c7526aab.woff') format('woff')`
    },
    icons: {
      'More': '\uE712',
      'Up': '\uE74A',
      'Down': '\uE74B',
      'Clear': '\uE894',
      'Info': '\uE946',
      'WifiWarning4': '\uEB63',
      'MoreVertical': '\uF2BC'
    }
  };

  registerIcons(subset, options);
}
