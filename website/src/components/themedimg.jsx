import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';

const ThemedImage = ({src, width = 500}) => {
  const { isDarkTheme } = useColorMode();

  return (
    <img src={useBaseUrl('/screenshots/' + src + (isDarkTheme ? '-dark' : '-light') + '.png')} style={{width}}/>
  )
}

export default ThemedImage;