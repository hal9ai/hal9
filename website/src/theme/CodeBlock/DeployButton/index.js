import React, {useCallback, useState, useRef, useEffect} from 'react';
import clsx from 'clsx';
import copy from 'copy-text-to-clipboard';
import {translate} from '@docusaurus/Translate';
import { Icon } from '@iconify/react';
import IconSuccess from '@theme/Icon/Success';
import styles from './styles.module.css';
export default function DeployButton({code, className}) {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef(undefined);
  const handleCopyCode = useCallback(() => {
    window.open("/deploy?code=" + encodeURIComponent(code));
    setIsCopied(true);
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [code]);
  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);
  return (
    <button
      type="button"
      aria-label={
        isCopied
          ? translate({
              id: 'theme.CodeBlock.copied',
              message: 'Copied',
              description: 'The copied button label on code blocks',
            })
          : translate({
              id: 'theme.CodeBlock.deployButtonAriaLabel',
              message: 'Copy code to clipboard',
              description: 'The ARIA label for copy code blocks button',
            })
      }
      title={translate({
        id: 'theme.CodeBlock.copy',
        message: 'Copy',
        description: 'The copy button label on code blocks',
      })}
      className={clsx(
        'clean-btn',
        className,
        styles.deployButton,
        isCopied && styles.deployButtonCopied,
      )}
      onClick={handleCopyCode}>
      <span className={styles.deployButtonIcons} aria-hidden="true">
        <Icon icon="mdi:rocket" />
        <Icon className={styles.deployButtonSuccessIcon} />
      </span>
    </button>
  );
}
