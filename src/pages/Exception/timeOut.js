import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception404 = () => (
  <Exception
    type="timeOut"
    desc={formatMessage({ id: 'app.exception.description.timeOut' })}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.loginAgain' })}
    redirect="/"
  />
);

export default Exception404;
