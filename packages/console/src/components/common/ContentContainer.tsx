import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import { contentContainerId } from 'common/constants';
import {
  contentMarginGridUnits,
  maxContainerGridWidth,
  sideNavGridWidth,
} from 'common/layout';
import { BreadCrumbs } from 'components/Breadcrumbs';
import { FeatureFlag, useFeatureFlag } from 'basics/FeatureFlags';
import { ErrorBoundary } from './ErrorBoundary';

enum ContainerClasses {
  Centered = 'centered',
  NoMargin = 'nomargin',
  WithDetailsPanel = 'withDetailsPanel',
  WithSideNav = 'withSideNav',
}

const useStyles = makeStyles((theme: Theme) => {
  const contentMargin = `${theme.spacing(contentMarginGridUnits)}px`;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: `100dvh`,
      padding: `0 ${contentMargin} 0 ${contentMargin}`,
      [`&.${ContainerClasses.NoMargin}`]: {
        margin: 0,
        padding: 0,
      },
      [`&.${ContainerClasses.Centered}`]: {
        margin: '0 auto',
        maxWidth: theme.spacing(maxContainerGridWidth),
      },
      [`&.${ContainerClasses.WithSideNav}`]: {
        marginLeft: theme.spacing(sideNavGridWidth),
      },
    },
  };
});

export interface ContentContainerProps
  extends React.AllHTMLAttributes<HTMLDivElement> {
  /** Renders content centered in the page. Usually should not be combined
   * with other modifiers
   */
  center?: boolean;
  /** Controls rendering of a `DetailsPanel` instance, which child content
   * can render into using `DetailsPanelContent`
   */
  detailsPanel?: boolean;
  /** Renders the container with no margin or padding.  Usually should not be combined
   * with other modifiers */
  noMargin?: boolean;
  /** Whether to include spacing for the SideNavigation component */
  sideNav?: boolean;
}

/** Defines the main content container for the application. Only one of these
 * should be present at a time, as it uses an id to assist with some
 * react-virtualized behavior.
 */
export const ContentContainer: React.FC<ContentContainerProps> = props => {
  const styles = useStyles();
  const {
    center = false,
    noMargin = true,
    className: additionalClassName,
    children,
    sideNav = false,
    ...restProps
  } = props;

  const className = classnames(styles.root, additionalClassName, {
    [ContainerClasses.Centered]: center,
    [ContainerClasses.NoMargin]: noMargin,
    [ContainerClasses.WithSideNav]: sideNav,
  });

  const isBreadcrumbFlag = useFeatureFlag(FeatureFlag.breadcrumbs);

  return (
    <div {...restProps} className={className} id={contentContainerId}>
      <ErrorBoundary>
        <>
          {isBreadcrumbFlag && <BreadCrumbs />}
          {children}
        </>
      </ErrorBoundary>
    </div>
  );
};
