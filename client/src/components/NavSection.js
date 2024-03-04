import { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
// next
import NextLink from "next/link";
import { useRouter } from "next/router";
// material
import { alpha, useTheme, styled } from "@material-ui/core/styles";
import {
  Box,
  List,
  ListItem,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  ListItemButton,
} from "@material-ui/core";
import useUser from "src/hooks/serverQueries/auth_hooks/useUser";

// ----------------------------------------------------------------------

const ListSubheaderStyle = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.overline,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(5),
  color: theme.palette.text.primary,
}));

const ListItemStyle = styled((props) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  "&:before": {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: "none",
    position: "absolute",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
  active: PropTypes.func,
  isShow: PropTypes.bool,
  item: PropTypes.object,
};

const Item = forwardRef(({ children, ...other }, ref) => {
  return <ListItemStyle {...other}>{children}</ListItemStyle>;
});

function NavItem({ item, active, isShow }) {
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: "primary.main",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
    "&:before": { display: "block" },
  };

  const activeSubStyle = {
    color: "text.primary",
    fontWeight: "fontWeightMedium",
  };

  if (children) {
    return (
      <>
        <Item
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle),
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>

          {isShow && (
            <>
              <ListItemText disableTypography primary={title} />
              {info && info}
              <Box
                component={Icon}
                icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
                sx={{ width: 16, height: 16, ml: 1 }}
              />
            </>
          )}
        </Item>

        {isShow && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {children.map((item) => {
                const isActiveSub = active(item.path);

                return (
                  <NextLink key={item.title} href={item.path}>
                    <Item
                      sx={{
                        ...(isActiveSub && activeSubStyle),
                      }}
                    >
                      <ListItemIconStyle>
                        <Box
                          component="span"
                          sx={{
                            width: 4,
                            height: 4,
                            display: "flex",
                            borderRadius: "50%",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "text.disabled",
                            transition: (theme) =>
                              theme.transitions.create("transform"),
                            ...(isActiveSub && {
                              transform: "scale(2)",
                              bgcolor: "primary.main",
                            }),
                          }}
                        />
                      </ListItemIconStyle>
                      <ListItemText disableTypography primary={item.title} />
                    </Item>
                  </NextLink>
                );
              })}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  return (
    <NextLink href={path}>
      <Item
        sx={{
          ...(isActiveRoot && activeRootStyle),
        }}
      >
        <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
        {isShow && (
          <>
            <ListItemText disableTypography primary={title} />
            {info && info}
          </>
        )}
      </Item>
    </NextLink>
  );
}

NavSection.propTypes = {
  isShow: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function NavSection({ navConfig, isShow = true, ...other }) {
  const { pathname } = useRouter();
  const match = (path) => pathname == path;
  const { status, data, error, isFetching } = useUser();

  return (
    <Box {...other}>
      {navConfig.map((list) => {
        const { subheader, items, access } = list;
        if (access.includes(data?.role))
          return (
            <List key={subheader} disablePadding>
              {isShow && <ListSubheaderStyle>{subheader}</ListSubheaderStyle>}
              {items.map((item) => (
                <NavItem
                  key={item.title}
                  active={match}
                  item={item}
                  isShow={isShow}
                />
              ))}
            </List>
          );
      })}
    </Box>
  );
}
