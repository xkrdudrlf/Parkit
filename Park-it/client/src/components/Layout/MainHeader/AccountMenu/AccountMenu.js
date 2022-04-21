import classes from "./AccountMenu.module.css";

import { Link } from "react-router-dom";
import { useContext } from "react";

import { Menu, MenuItem, Typography, Divider } from "@mui/material";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

import AuthContext from "../../../../contexts/auth-context";

const AccountMenu = ({ open, anchorEl, onClose, anchorOrigin }) => {
  const authContext = useContext(AuthContext);

  const logoutHandler = () => {
    onClose();
    authContext.logout();
  };

  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      PopoverClasses={{
        paper: classes.accountMenu,
      }}
    >
      <MenuItem onClick={onClose} component={Link} to="/account/details">
        <ManageAccountsOutlinedIcon className={classes.menuItemIcon} />
        <Typography className={classes.menuItemText}>
          Account Details
        </Typography>
      </MenuItem>

      <Divider sx={{ my: 3 }} />

      <MenuItem
        onClick={onClose}
        component={Link}
        to="/account/history/provider"
      >
        <ManageSearchOutlinedIcon className={classes.menuItemIcon} />
        <Typography className={classes.menuItemText}>
          Provider History
        </Typography>
      </MenuItem>

      <MenuItem
        onClick={onClose}
        component={Link}
        to="/account/history/consumer"
      >
        <ManageSearchOutlinedIcon className={classes.menuItemIcon} />
        <Typography className={classes.menuItemText}>
          Consumer Bookings
        </Typography>
      </MenuItem>

      <MenuItem onClick={onClose} component={Link} to="/account/myCars">
        <DirectionsCarIcon className={classes.menuItemIcon} />
        <Typography className={classes.menuItemText}>My Cars</Typography>
      </MenuItem>

      <MenuItem onClick={onClose} component={Link} to="/account/favourites">
        <FavoriteBorderOutlinedIcon className={classes.menuItemIcon} />
        <Typography className={classes.menuItemText}>Favourites</Typography>
      </MenuItem>

      <Divider sx={{ my: 3 }} />

      <MenuItem onClick={logoutHandler} component={Link} to="/">
        <LogoutOutlinedIcon className={classes.menuItemIcon} />
        <Typography className={classes.menuItemText}>Logout</Typography>
      </MenuItem>
    </Menu>
  );
};

export default AccountMenu;
