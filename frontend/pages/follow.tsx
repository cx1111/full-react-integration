import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Button, Container, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Layout from "../components/Layout";
import { forumAPI, ListTopicsResponse } from "../lib/endpoints/forum";
import { useFetch } from "../hooks/useFetch";
import { parseError } from "lib/endpoints/error";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topicsList: {
      marginTop: theme.spacing(2),
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      //   border: "1px solid",
    },
  })
);

const Follow: React.FC = ({}) => {
  const classes = useStyles();

  // Displayed topics
  const [
    { data: topicsData, error: topicsError, loading: topicsLoading },
    {
      setData: setTopicsData,
      setError: setTopicsError,
      setLoading: setTopicsLoading,
    },
  ] = useFetch<ListTopicsResponse>({ loading: false });

  const loadTopics = React.useCallback(async () => {
    try {
      setTopicsLoading(true);
      const response = await forumAPI.listTopics();
      setTopicsData(response.data);
    } catch (e) {
      const errorInfo = parseError<null>(e);
      if (errorInfo) {
        setTopicsError(errorInfo.detail);
      }
      setTopicsData(undefined);
    } finally {
      setTopicsLoading(false);
    }
  }, [setTopicsData, setTopicsLoading, setTopicsError]);

  React.useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  return (
    <Layout>
      <Container maxWidth="sm">
        <div>
          <Typography component={"h1"} variant={"h2"}>
            Follow Topics
          </Typography>
        </div>
        {topicsLoading && <Typography>Loading...</Typography>}
        {topicsError && (
          <Typography>Error loading topics: {topicsError}</Typography>
        )}
        {topicsData && (
          <div className={classes.topicsList}>
            <List component="nav" aria-label="topics">
              {topicsData.map((topic) => (
                <>
                  <ListItem>
                    <ListItemText primary={topic.name} />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      aria-label="follow"
                    >
                      Follow
                    </Button>
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Follow;
