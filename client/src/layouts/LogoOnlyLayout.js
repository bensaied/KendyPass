import PropTypes from 'prop-types';
// next
import NextLink from 'next/link';
// material
import { styled } from '@material-ui/core/styles';
// components
import Logo from '../components/Logo';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

LogoOnlyLayout.propTypes = {
  children: PropTypes.node,
};

export default function LogoOnlyLayout({ children }) {
  return (
    <>
      <HeaderStyle>
        <NextLink href='/'>
          <Logo />
        </NextLink>
      </HeaderStyle>
      {children}
    </>
  );
}
