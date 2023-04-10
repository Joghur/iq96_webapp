import React from 'react';
import Typography, {TypographyProps} from '@mui/material/Typography';
import {
  useTheme,
  useMediaQuery,
  TypographyVariant,
  SxProps,
  Theme,
} from '@mui/material';

interface Props {
  mobile?: TypographyVariant;
  desktop?: TypographyVariant;
  children?: React.ReactNode;
  props?: TypographyProps;
  sx?: SxProps<Theme>;
}

export default function DynamicText({
  mobile = 'body2',
  desktop = 'body1',
  children,
  sx,
  ...props
}: Props) {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Typography variant={small ? mobile : desktop} {...props} sx={sx}>
      {children}
    </Typography>
  );
}
