import React, { useState } from 'react';
import { Button, Dialog } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import classnames from 'classnames';
import { useCommonStyles } from 'components/common/styles';
import { ResourceIdentifier, ResourceType } from 'models/Common/types';
import { Project } from 'models/Project/types';
import { getProjectDomain } from 'models/Project/utils';
import { Link } from 'react-router-dom';
import { LaunchForm } from 'components/Launch/LaunchForm/LaunchForm';
import { useEscapeKey } from 'components/hooks/useKeyListener';
import { BreadcrumbTitleActions } from 'components/Breadcrumbs';
import { FeatureFlag, useFeatureFlag } from 'basics/FeatureFlags';
import { backUrlGenerator, backToDetailUrlGenerator } from './generators';
import { entityStrings } from './constants';
import t, { patternKey } from './strings';

const useStyles = makeStyles((theme: Theme) => ({
  headerContainer: {
    alignItems: 'center',
    display: 'flex',
    height: theme.spacing(5),
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    width: '100%',
  },
  headerText: {
    margin: theme.spacing(0, 1),
  },
  headerTextContainer: {
    display: 'flex',
    flex: '1 0 auto',
  },
}));

interface EntityDetailsHeaderProps {
  project: Project;
  id: ResourceIdentifier;
  launchable?: boolean;
  backToWorkflow?: boolean;
}

function getLaunchProps(id: ResourceIdentifier) {
  if (id.resourceType === ResourceType.TASK) {
    return { taskId: id };
  }

  return { workflowId: id };
}

/**
 * Renders the entity name and any applicable actions.
 * @param id
 * @param project
 * @param launchable - controls if we show launch button
 * @param backToWorkflow - if true breadcrumb navigates to main workflow details view.
 * @constructor
 */
export const EntityDetailsHeader: React.FC<EntityDetailsHeaderProps> = ({
  id,
  project,
  launchable = false,
  backToWorkflow = false,
}) => {
  const styles = useStyles();
  const commonStyles = useCommonStyles();

  const [showLaunchForm, setShowLaunchForm] = useState(false);
  const onCancelLaunch = (_?: KeyboardEvent) => {
    setShowLaunchForm(false);
  };

  // Close modal on escape key press
  useEscapeKey(onCancelLaunch);

  const domain = project ? getProjectDomain(project, id.domain) : undefined;
  const headerText = domain ? `${domain.name} / ${id.name}` : '';

  const isBreadcrumbFlag = useFeatureFlag(FeatureFlag.breadcrumbs);

  return (
    <>
      {!isBreadcrumbFlag && (
        <div className={styles.headerContainer}>
          <div
            className={classnames(
              commonStyles.mutedHeader,
              styles.headerTextContainer,
            )}
          >
            <Link
              className={commonStyles.linkUnstyled}
              to={
                backToWorkflow
                  ? backToDetailUrlGenerator[id.resourceType](id)
                  : backUrlGenerator[id.resourceType](id)
              }
            >
              <ArrowBack color="inherit" />
            </Link>
            <span className={styles.headerText}>{headerText}</span>
          </div>
        </div>
      )}
      {isBreadcrumbFlag && (
        <div>
          <BreadcrumbTitleActions>
            {launchable ? (
              <Button
                color="primary"
                id="launch-workflow"
                onClick={() => setShowLaunchForm(true)}
                variant="contained"
              >
                {t(patternKey('launchStrings', entityStrings[id.resourceType]))}
              </Button>
            ) : (
              <></>
            )}
          </BreadcrumbTitleActions>
        </div>
      )}
      {launchable ? (
        <Dialog
          scroll="paper"
          maxWidth="sm"
          fullWidth={true}
          open={showLaunchForm}
        >
          <LaunchForm onClose={onCancelLaunch} {...getLaunchProps(id)} />
        </Dialog>
      ) : null}
    </>
  );
};
