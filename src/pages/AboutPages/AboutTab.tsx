import {Stack} from '@mui/material';
import React from 'react';
import packageJson from '../../../package.json';
import DynamicText from '../../components/DynamicText';

const AboutTab = () => {
  return (
    <Stack alignItems="center" spacing={2}>
      <DynamicText>
        <strong>{`IQ96 web app v${packageJson.version}`}</strong>
      </DynamicText>
      <ul>
        <li>
          0.6.0 - Omdåbt Indstillinger til Om (About) da der ikke er så meget at
          indstille - Opdateret
        </li>
        <li>
          0.4.4 - Forbedret login oplevelse (mindre flimren) - check for om
          lokation er sat til
        </li>
      </ul>
    </Stack>
  );
};

export default AboutTab;
