import React, { Suspense } from 'react';
import { renderRoutes, RouteConfig } from 'react-router-config';

import { Grid } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

import Meta from './Meta';
import Loading from './Loading';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  wrapper: {
    margin: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(1)}px) auto 0 auto`,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(1)}px)`,
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  }
}));

type Props = {
  route?: RouteConfig;
};

const Layout = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Meta />
      <Grid container>
        <Grid item xs={12} sm={9} className={classes.wrapper}>
          <Suspense fallback={<Loading />}>{renderRoutes(props.route!.routes)}</Suspense>
        </Grid>
      </Grid>
    </div>
  );
};

export default Layout;
