import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { InfoIcon } from '@flyteorg/ui-atoms';
import CloseIcon from '@material-ui/icons/Close';
import { VersionDisplay, VersionDisplayProps } from './versionDisplay';

export type { VersionInfo } from './versionDisplay';

export const INFO_WINDOW_WIDTH = 260;

const useStyles = makeStyles((theme: Theme) => ({
  infoIcon: {
    cursor: 'pointer',
    backgroundColor: 'initial',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(0.5),
    top: theme.spacing(0.5),
  },
  content: {
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'initial',
  },
  dialog: {
    width: `${INFO_WINDOW_WIDTH}px`,
    maxWidth: `calc(100% - ${theme.spacing(2)}px)`,
    maxHeight: `calc(100% - ${theme.spacing(2)}px)`,
  },
}));

export const AppInfo = (props: VersionDisplayProps) => {
  const [showVersionInfo, setShowVersionInfo] = React.useState(false);

  const styles = useStyles();

  const onCloseDialog = () => setShowVersionInfo(false);
  return (
    <>
      <InfoIcon
        width={20}
        height={20}
        className={styles.infoIcon}
        onClick={() => setShowVersionInfo(true)}
      />
      <Dialog
        PaperProps={{ className: styles.dialog }}
        maxWidth={false}
        open={showVersionInfo}
        onClose={onCloseDialog}
      >
        <DialogTitle>
          <IconButton
            aria-label="Close"
            className={styles.closeButton}
            onClick={onCloseDialog}
            data-testid="closeButton"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className={styles.content}>
          <VersionDisplay {...props} />
        </DialogContent>
      </Dialog>
    </>
  );
};
