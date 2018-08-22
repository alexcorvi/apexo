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
      src: `url('${baseUrl}fabric-icons-ac63a47f.woff') format('woff')`
    },
    icons: {
      'GlobalNavButton': '\uE700',
      'ChevronDown': '\uE70D',
      'ChevronUp': '\uE70E',
      'Add': '\uE710',
      'Cancel': '\uE711',
      'Settings': '\uE713',
      'Search': '\uE721',
      'CheckMark': '\uE73E',
      'Delete': '\uE74D',
      'ContactInfo': '\uE779',
      'Contact': '\uE77B',
      'Error': '\uE783',
      'Calendar': '\uE787',
      'Warning': '\uE7BA',
      'Home': '\uE80F',
      'Sync': '\uE895',
      'Download': '\uE896',
      'Upload': '\uE898',
      'ChromeClose': '\uE8BB',
      'CalendarWeek': '\uE8C0',
      'Important': '\uE8C9',
      'Timer': '\uE91E',
      'ChevronUpSmall': '\uE96D',
      'ChevronDownSmall': '\uE96E',
      'Chart': '\uE999',
      'ErrorBadge': '\uEA39',
      'DietPlanNotebook': '\uEAC8',
      'Pill': '\uEACB',
      'Cricket': '\uEB1E',
      'StatusErrorFull': '\uEB90',
      'ContactCard': '\uEEBD',
      'CollapseMenu': '\uEF66',
      'StatusCircleErrorX': '\uF13D',
      'AlertSolid': '\uF331',
      'ReleaseGateError': '\uF7C0'
    }
  };

  registerIcons(subset, options);
}
