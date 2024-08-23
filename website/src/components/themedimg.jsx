import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';

const ThemedImage = ({src}) => {
  const { isDarkTheme } = useColorMode();

  return (
    <img src={useBaseUrl('/screenshots/' + src + (isDarkTheme ? '-dark' : '-light') + '.png')} style={{width: 500}}/>
  )
}

export default ThemedImage;