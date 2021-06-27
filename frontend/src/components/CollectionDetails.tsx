/* eslint-disable no-script-url */

import React from 'react';
import { observer } from 'mobx-react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Title from './Title';
import { StoreProps } from '../types/PropsTypes';
import TagChipFactory from './TagChipFactory';
import CircularLoading from './CircularLoading';
import { NestedKeyword } from '../types/ModelTypes';
import Accordion from '@material-ui/core/ExpansionPanel';
import AccordionSummary from '@material-ui/core/ExpansionPanelSummary';
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
    tile: {
      backgroundColor: "#ffffff",
      outlineStyle: "solid",
      outlineWidth: "1pt",
      outlineColor: "#a0a0a0",
      margin: "4px 0",
    },
    documentation: {
      paddingBottom: "5pt",
      paddingTop: "5pt",
      paddingLeft: "20pt",
      paddingRight: "20pt",
      backgroundColor: "#3f51b50f"
    }
  }),
);

function timeField(value: number | null) {
  return value ? `${value} ms` : null
}

function AccordionItem(props: { keyword: NestedKeyword }) {
  const { keyword } = props;
  const [expanded, setExpanded] = React.useState(false);
  const [openCpTooltip, setOpenCpTooltip] = React.useState(false);
  const classes = useStyles();

  const handleCpTooltipOpen = () => {
    setOpenCpTooltip(true);
  };

  const handleCpTooltipClose = () => {
    setOpenCpTooltip(false);
  };

  return (
    <React.Fragment>
      <Accordion
        id={keyword.id.toString()}
        expanded={expanded}
        onChange={() => {
          setExpanded(!expanded);
        }}
        className={classes.tile}
      >
        <AccordionSummary>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={1}
          >
            {expanded
              ?
              <React.Fragment>
                < Grid item xs>
                  <Typography variant="h5"><b>{keyword.name}</b></Typography>
                </Grid>
                <Grid item xs={1}>
                  <ClickAwayListener onClickAway={handleCpTooltipClose}>
                    <div>
                      <Tooltip
                        title="Copied to clipboard!"
                        PopperProps={{
                          disablePortal: true,
                        }}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        open={openCpTooltip}
                        onClose={handleCpTooltipClose}>
                        <CopyToClipboard text={keyword.name}>
                          <IconButton onClick={(event) => {
                            event.stopPropagation();
                            handleCpTooltipOpen();
                          }}>
                            <AssignmentIcon />
                          </IconButton>
                        </CopyToClipboard>
                      </Tooltip>
                    </div>
                  </ClickAwayListener>
                </Grid>
              </React.Fragment>
              :
              <React.Fragment>
                <Grid item xs>
                  <Typography variant="body1"><b>{keyword.name}</b></Typography>
                  {keyword.tags.length > 0 &&
                    keyword.tags.map(tag => TagChipFactory.get(tag))
                  }
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="body2">{keyword.synopsis}</Typography>
                </Grid>
              </React.Fragment>
            }
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1} direction="column">
            {keyword.tags.length > 0 &&
              <Grid item xs>
                <Paper elevation={2} className={classes.documentation}>
                  <Typography variant="h6"><b>Tags</b></Typography>
                  {keyword.tags.map(tag => TagChipFactory.get(tag))}
                </Paper>
              </Grid>
            }
            {keyword.arg_string.length > 0 &&
              <Grid item xs>
                <Paper elevation={2} className={classes.documentation}>
                  <Typography variant="h6"><b>Arguments</b></Typography>
                  <Typography variant="body2">{keyword.arg_string}</Typography>
                </Paper>
              </Grid>
            }
            {keyword.html_doc.length > 0 &&
              <Grid item xs>
                <Paper elevation={2} className={classes.documentation}>
                  <Typography variant="h6"><b>Documentation</b></Typography>
                  <div
                    dangerouslySetInnerHTML={{ __html: keyword.html_doc }}></div>
                </Paper>
              </Grid>
            }
            <Grid item xs>
              <Paper elevation={2} className={classes.documentation}>
                <Typography variant="h6"><b>Statistics</b></Typography>
                <Typography variant="body2">Times used: {keyword.times_used || "N/A"}</Typography>
                <Typography variant="body2">Avg. elapsed time: {timeField(keyword.avg_elapsed) || "N/A"}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </React.Fragment >
  );
}

@observer
export default class CollectionDetails extends React.Component<StoreProps> {

  componentDidUpdate() {
    if (this.props.store.selectedKeywordId) {
      const element = document.getElementById(this.props.store.selectedKeywordId.toString());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  render() {
    const store = this.props.store;
    let view
    if (store.loading.getCollection === true && !store.detailCollection) {
      view = <CircularLoading view={store.loading.getCollection} />
    } else {
      if (store && store.detailCollection) {
        view = (
          <React.Fragment>
            <Title>{store.detailCollection.name}</Title>
            <div>version: {store.detailCollection.version}</div>
            <div>scope: {store.detailCollection.scope}</div>
            <div>path: {store.detailCollection.path}</div>
            <div dangerouslySetInnerHTML={{ __html: store.detailCollection.html_doc }}></div>
            <Title>Keywords ({store.detailCollection.keywords.length})</Title>
            {store.detailCollection.keywords.map(keyword => (
              <AccordionItem key={keyword.id} keyword={keyword} />
            ))}
          </React.Fragment >
        )
      } else {
        view = (
          <React.Fragment>
            <Title>Collection not found</Title>
          </React.Fragment>
        )
      }
    }

    return (
      <React.Fragment>
        {view}
      </React.Fragment>
    )
  }
}