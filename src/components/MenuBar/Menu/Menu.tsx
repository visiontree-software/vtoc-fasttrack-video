import React, { useState, useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AboutDialog from '../AboutDialog/AboutDialog';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
import UserAvatar from '../UserAvatar/UserAvatar';

import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function Menu() {
  const { user } = useAppState();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={anchorRef}>
      <Tooltip title="Menu" placement="top" PopperProps={{ disablePortal: true }}>
        <IconButton onClick={() => setMenuOpen(state => !state)}>
          <MoreIcon />
        </IconButton>
      </Tooltip>
      <MenuContainer open={menuOpen} onClose={() => setMenuOpen(state => !state)} anchorEl={anchorRef.current}>
        {user?.displayName && <MenuItem disabled>{user.displayName}</MenuItem>}
        <MenuItem onClick={() => setAboutOpen(true)}>About</MenuItem>
        <MenuItem onClick={() => setSettingsOpen(true)}>Settings</MenuItem>
        {/* {user && <MenuItem onClick={handleSignOut}>Logout</MenuItem>} */}
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <SettingsDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </div>
  );
}
